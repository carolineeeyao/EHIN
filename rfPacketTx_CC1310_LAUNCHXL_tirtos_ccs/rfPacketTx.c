/*
 * Copyright (c) 2015-2017, Texas Instruments Incorporated
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * *  Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * *  Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * *  Neither the name of Texas Instruments Incorporated nor the names of
 *    its contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/***** Includes *****/
/* XDCtools Header files */
#include <xdc/std.h>
#include <xdc/runtime/System.h>

/* Standard C Libraries */
#include <stdlib.h>
#include <stdint.h>
#include <stddef.h>
#include <math.h>
#include <time.h>

/* XDCtools Header files */
#include <xdc/std.h>
#include <xdc/runtime/Assert.h>

/* BIOS Header files */
#include <ti/sysbios/BIOS.h>
#include <ti/sysbios/knl/Task.h>
#include <ti/sysbios/knl/Semaphore.h>
#include <ti/sysbios/gates/GateMutexPri.h>

/* TI Drivers */
#include <ti/drivers/rf/RF.h>
#include <ti/drivers/I2C.h>
#include <ti/drivers/PIN.h>
#include <ti/drivers/UART.h>
#include <ti/drivers/pin/PINCC26XX.h>

/* Driverlib Header files */
#include DeviceFamily_constructPath(driverlib/rf_prop_mailbox.h)

/* Board Header files */
#include "Board.h"
#include "string.h"
#include "stdio.h"
#include "opt3001.h"
#include "tmp007.h"
#include "math.h"
#include "bme280_support.h"
#include "bmi160_support.h"

/* Application Header files */
#include "smartrf_settings/smartrf_settings.h"

/***** Defines *****/
#define TX_TASK_STACK_SIZE 1024
#define TX_TASK_PRIORITY   2

/* Packet TX Configuration */
#define PAYLOAD_LENGTH      255
#define PACKET_INTERVAL     (uint32_t)(8000000*0.5f) /* Set packet interval to 1 sec */

/* Do power measurement */
//#define POWER_MEASUREMENT

/***** Prototypes *****/
static void txTaskFunction(UArg arg0, UArg arg1);

/***** Variable declarations *****/
static Task_Params txTaskParams;
Task_Struct txTask;    /* not static so you can see in ROV */
static uint8_t txTaskStack[TX_TASK_STACK_SIZE];

static RF_Object rfObject;
static RF_Handle rfHandle;

/* Pin driver handle */
static PIN_Handle ledPinHandle;
static PIN_State ledPinState;

static uint8_t packet[PAYLOAD_LENGTH];
static PIN_Handle pinHandle;

// TMP007
uint16_t rawTemp;
uint16_t rawObjTemp;
float    tObjTemp;
float    tObjAmb;

// OPT3001
uint16_t rawData;
uint16_t e, m;
float    convertedLux;

// BME280
s32     g_s32ActualTemp = 0;
u32     g_u32ActualPress = 0;
u32     g_u32ActualHumity = 0;

// BMI160/BMM150
struct bmi160_gyro_t        s_gyroXYZ;
struct bmi160_accel_t       s_accelXYZ;
struct bmi160_mag_xyz_s32_t s_magcompXYZ;

//Calibration off-sets
int8_t accel_off_x;
int8_t accel_off_y;
int8_t accel_off_z;
int16_t gyro_off_x;
int16_t gyro_off_y;
int16_t gyro_off_z;

/* I2C handle */
I2C_Handle      i2c;
I2C_Params      i2cParams;
I2C_Transaction i2cTransaction;

#define TASKSTACKSIZE       640

/*
 * Application LED pin configuration table:
 *   - All LEDs board LEDs are off.
 */
PIN_Config pinTable[] =
{
    Board_PIN_LED1 | PIN_GPIO_OUTPUT_EN | PIN_GPIO_LOW | PIN_PUSHPULL | PIN_DRVSTR_MAX,
#if defined __CC1352R1_LAUNCHXL_BOARD_H__
    Board_DIO30_RFSW | PIN_GPIO_OUTPUT_EN | PIN_GPIO_HIGH | PIN_PUSHPULL | PIN_DRVSTR_MAX,
#endif
#ifdef POWER_MEASUREMENT
#if !defined(__CC1352R1_LAUNCHXL_BOARD_H__) && !defined(__CC26X2R1_LAUNCHXL_BOARD_H__)
    CC1350_LAUNCHXL_DIO30_SWPWR | PIN_GPIO_OUTPUT_EN | PIN_GPIO_HIGH | PIN_PUSHPULL | PIN_DRVSTR_MAX,
#endif
#endif
    PIN_TERMINATE
};

/***** Function definitions *****/
void TxTask_init(PIN_Handle inPinHandle)
{
    pinHandle = inPinHandle;

    Task_Params_init(&txTaskParams);
    txTaskParams.stackSize = TX_TASK_STACK_SIZE;
    txTaskParams.priority = TX_TASK_PRIORITY;
    txTaskParams.stack = &txTaskStack;
    txTaskParams.arg0 = (UInt)1000000;

    Task_construct(&txTask, txTaskFunction, &txTaskParams, NULL);
}

static void txTaskFunction(UArg arg0, UArg arg1)
{
#ifdef POWER_MEASUREMENT
    /* Shutdown external flash */
    Board_shutDownExtFlash();
#if !defined(__CC1352R1_LAUNCHXL_BOARD_H__) && !defined(__CC26X2R1_LAUNCHXL_BOARD_H__)
    /* Route out PA active pin to Board_DIO30_SWPWR */
    PINCC26XX_setMux(ledPinHandle, Board_DIO30_SWPWR, PINCC26XX_MUX_RFC_GPO1);
#endif
#endif
    uint32_t curtime;
    RF_Params rfParams;
    RF_Params_init(&rfParams);

    RF_cmdPropTx.pktLen = PAYLOAD_LENGTH;
    RF_cmdPropTx.pPkt = packet;
    RF_cmdPropTx.startTrigger.triggerType = TRIG_ABSTIME;
    RF_cmdPropTx.startTrigger.pastTrig = 1;
    RF_cmdPropTx.startTime = 0;

    /* Request access to the radio */
    rfHandle = RF_open(&rfObject, &RF_prop, (RF_RadioSetup*)&RF_cmdPropRadioDivSetup, &rfParams);

    /* Set the frequency */
    RF_postCmd(rfHandle, (RF_Op*)&RF_cmdFs, RF_PriorityNormal, NULL, 0);

    /* Get current time */
    curtime = RF_getCurrentTime();

    /* Create I2C for usage */
    I2C_Params_init(&i2cParams);
    i2cParams.bitRate = I2C_400kHz;
    i2c = I2C_open(Board_I2C0, &i2cParams);

    /* Initialize the OPT Sensor */
    sensorOpt3001Init();
    sensorOpt3001Enable(true);

    /* Initialize the BME Sensor */
    bme280_data_readout_template();
    bme280_set_power_mode(BME280_NORMAL_MODE);

    /* Initialize the BMI Sensor */
    bmi160_initialize_sensor();
    bmi160_config_running_mode(APPLICATION_NAVIGATION);
    bmi160_accel_foc_trigger_xyz(0x03, 0x03, 0x01, &accel_off_x, &accel_off_y, &accel_off_z);
    bmi160_set_foc_gyro_enable(0x01, &gyro_off_x, &gyro_off_y, &gyro_off_z);

    while(1) {
        //tmp
        if (sensorTmp007Read(&rawTemp, &rawObjTemp)) {
            sensorTmp007Convert(rawTemp, rawObjTemp, &tObjTemp, &tObjAmb);
        }

        //opt
        if (sensorOpt3001Read(&rawData)) {
            sensorOpt3001Convert(rawData, &convertedLux);
        }
        m = rawData & 0x0FFF;
        e = (rawData & 0xF000) >> 12;

        //bme
        bme280_read_pressure_temperature_humidity(&g_u32ActualPress, &g_s32ActualTemp, &g_u32ActualHumity);

        //bmi
        bmi160_read_accel_xyz(&s_accelXYZ);
        bmi160_read_gyro_xyz(&s_gyroXYZ);
        bmi160_bmm150_mag_compensate_xyz(&s_magcompXYZ);

        // - Length is the first byte with the current configuration
        // - Data starts from the second byte */
        /* Create packet with incrementing sequence number and random payload */
        //sprintf(packet, "objTemp: %f, convertedLux: %f, actualPres: %u, actualTemp: %d, actualHumidity: %u, accelX: %hi, accelY: %hi, accelZ: %hi, gyroX: %hi, gyroY: %hi, gyroZ: %hi, magX: %d, magY: %d, magZ: %d",
        //when tObjTemp and convertedLux are properly formated as a float the packet does not send. Possible because the conversion from float to string takes too long?
        sprintf(packet, "%hu,%hu,%hu,%hu,%u,%d,%u,%hi,%hi,%hi,%hi,%hi,%hi,%d,%d,%d",
                    rawTemp, rawObjTemp,
                    m, e,
                    g_u32ActualPress, g_s32ActualTemp, g_u32ActualHumity,
                    s_accelXYZ.x, s_accelXYZ.y, s_accelXYZ.z,
                    s_gyroXYZ.x, s_gyroXYZ.y, s_gyroXYZ.z,
                    s_magcompXYZ.x, s_magcompXYZ.y, s_magcompXYZ.z);

        /* Set absolute TX time to utilize automatic power management */
        curtime += PACKET_INTERVAL;
        RF_cmdPropTx.startTime = curtime;

        /* Send packet */
        RF_EventMask terminationReason = RF_runCmd(rfHandle, (RF_Op*)&RF_cmdPropTx,
                                                   RF_PriorityNormal, NULL, 0);

        switch(terminationReason)
        {
            case RF_EventCmdDone:
                // A radio operation command in a chain finished
                break;
            case RF_EventLastCmdDone:            
                // A stand-alone radio operation command or the last radio 
                // operation command in a chain finished.
                break;         
            case RF_EventCmdCancelled:
                // Command cancelled before it was started; it can be caused
            // by RF_cancelCmd() or RF_flushCmd().
                break;
            case RF_EventCmdAborted:
                // Abrupt command termination caused by RF_cancelCmd() or 
                // RF_flushCmd().
                break;  
            case RF_EventCmdStopped:
                // Graceful command termination caused by RF_cancelCmd() or 
                // RF_flushCmd().
                break;  
            default:                
                // Uncaught error event
                Assert_isTrue(false, NULL);
        }
        
        uint32_t cmdStatus = ((volatile RF_Op*)&RF_cmdPropTx)->status;
        switch(cmdStatus)
        {
            case PROP_DONE_OK:
                // Packet transmitted successfully
                break;
            case PROP_DONE_STOPPED:
                // received CMD_STOP while transmitting packet and finished
                // transmitting packet
                break;
            case PROP_DONE_ABORT:
                // Received CMD_ABORT while transmitting packet
                break;
            case PROP_ERROR_PAR:
                // Observed illegal parameter
                break;
            case PROP_ERROR_NO_SETUP:
                // Command sent without setting up the radio in a supported
                // mode using CMD_PROP_RADIO_SETUP or CMD_RADIO_SETUP
                break;
            case PROP_ERROR_NO_FS:
                // Command sent without the synthesizer being programmed
                break;
            case PROP_ERROR_TXUNF:
                // TX underflow observed during operation
                break;
            default:
                // Uncaught error event - these could come from the
                // pool of states defined in rf_mailbox.h
                Assert_isTrue(false, NULL);
        }
#ifndef POWER_MEASUREMENT
        PIN_setOutputValue(pinHandle, Board_PIN_LED1,!PIN_getOutputValue(Board_PIN_LED1));
#endif
    }
}

/*
 *  ======== main ========
 */
int main(void)
{
    /* Call driver init functions. */
    Board_initGeneral();
    Board_initUART();
    Board_initI2C();

    /* Open LED pins */
    ledPinHandle = PIN_open(&ledPinState, pinTable);
    Assert_isTrue(ledPinHandle != NULL, NULL);

    /* Initialize task */
    TxTask_init(ledPinHandle);

    /* Start BIOS */
    BIOS_start();

    return (0);
}
