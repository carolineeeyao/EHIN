import serial
import MySQLdb
import datetime

def addToGraphDatabase(table, val, txid, timestamp):
    sql = "insert into " + table + " (Txid, Value, TimeRead) Values ({}, {}, '{}')".format(txid, val, timestamp)
    try:        
        cur.execute(sql)
        db.commit()
    except e:
        #print e
        print sql

def addToTableDatabase(table, x, y, z, txid, timestamp):
    sql = "insert into " + table + " (Txid, x, y, z, TimeRead) Values({}, {}, {}, {}, '{}')".format(txid, x, y, z, timestamp)
    try:
        cur.execute(sql)
        db.commit()
    except e:
        print e

if __name__ == "__main__":
    ser = serial.Serial('/dev/tty.usbmodemL2000HR1', 9600)
    ser.readline()
    db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                        user="root",         # your username
                        passwd="password",  # your password
                        db="SeniorDesign")        # name of the data base
    cur = db.cursor()
    while True:
        try:
            packet = ser.readline()[1:]#first byte sent is the length of packet

            print packet
            print len(packet)
            timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
            if packet[:3] == "IAQ":
                (SN, 
                PPB, 
                TEMP, 
                RH, 
                RawSensor,
                TempDigital, 
                RHDigital, 
                Day, 
                Hour, 
                Minute,
                Second) = packet[3:].split(",")
                addToGraphDatabase("IAQ", PPB, 1, timestamp)
            elif packet[:3] == "SBP":
                (rawTemp, 
                rawObjTemp, 
                m, 
                e, 
                g_u32ActualPress, 
                g_s32ActualTemp, 
                g_u32ActualHumity, 
                s_accelXYZ_x, 
                s_accelXYZ_y, 
                s_accelXYZ_z, 
                s_gyroXYZ_x, 
                s_gyroXYZ_y, 
                s_gyroXYZ_z, 
                s_magcompXYZ_x, 
                s_magcompXYZ_y, 
                s_magcompXYZ_z,
                i) = packet[3:].split(",")
                lux = int(m) * (0.01 * (2 ** int(e)))
                tmp = int(rawObjTemp)*.03125
                i = int(i[:1])

                addToGraphDatabase("Temperature", tmp, i, timestamp)
                addToGraphDatabase("Humidity", g_u32ActualHumity, i, timestamp)
                addToGraphDatabase("Pressure", g_u32ActualPress, i, timestamp)
                addToGraphDatabase("LightIntensity", lux, i, timestamp)
                addToTableDatabase("Accelerometer", s_accelXYZ_x, s_accelXYZ_y, s_accelXYZ_z, i, timestamp)
                addToTableDatabase("Gyroscope", s_gyroXYZ_x, s_gyroXYZ_y, s_gyroXYZ_z, i, timestamp)
                addToTableDatabase("MagneticForce", s_magcompXYZ_x, s_magcompXYZ_y, s_magcompXYZ_z, i, timestamp)
        except:
            pass

        #sql = "insert into Humidity(Txid, Value, TimeRead) Values (1, {}, '1970-01-01 00:00:01')".format(g_u32ActualHumity)
        #try:
        
            #cur.execute("SELECT * FROM Temperature limit 5")
            #cur.execute(sql)
            #db.commit()

            #print cur.fetchall()
        #except e:
            #print e
