# EHIN

The overall system is an environmental IoT node that harvests energy from the environment to transmit sensor data to the user. The design can be organized into four subsystems: energy harvesting, sensors, data transmission composed of a transmitter and receiver, and user interface (see Figure 1). The energy harvesting subsystem gathers, regulates, and supplies power to the sensor subsystem and transmitter. The sensor subsystem measures environmental data every second and communicates this information to the transmitter. The transmitter processes the data and sends it to the receiver, which provides it to the user interface subsystem. The measured data will finally be displayed on a website, where relevant components will be updated accordingly.

## Getting Started

For this project you will need to purchase the following hardware:
3x [TI CC1310 Launchpads](https://www.digikey.com/products/en?mpart=LAUNCHXL-CC1310&v=296)
2x [TI Sensor BoosterPack](https://www.digikey.com/products/en?mpart=BOOSTXL-SENSORS&v=296)
2x [SPEC IAQ Sensor](https://www.spec-sensors.com/product/digital-gas-sensor-module-iaq)

### Prerequisites

In addition, you will need to install TI's IDE [Code Composer Studio](http://processors.wiki.ti.com/index.php/Download_CCS#Download_the_latest_CCS). Along with the [CC1310 SDK](http://www.ti.com/tool/download/SIMPLELINK-CC13X0-SDK).

### Installing

To get a development enviroment running, first download and unzip the 3 CCS projects found in this repo.
Next, open Code Composer Studio and import each project. Finally build and flash the Tx Project onto 2 launchpads and the Rx Project onto the last launchpad.

The Tx launchpads should each have a green LED which toggles every second, and the Rx launchpad has a red LED which toggles whenever it receives a transmission.
