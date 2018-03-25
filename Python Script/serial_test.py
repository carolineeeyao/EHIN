import serial
# import MySQLdb

ser = serial.Serial('/dev/tty.usbmodemL2000IS1', 9600)
ser.readline()
# db = MySQLdb.connect(host="localhost",    # your host, usually localhost
#                      user="root",         # your username
#                      passwd="password",  # your password
#                      db="SeniorDesign")        # name of the data base
# cur = db.cursor()
while True:
    packet = ser.readline()
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
    s_magcompXYZ_z) = packet[1:][:70].split(",")
    # try:
    #     with db.cursor() as cur:
    #         cur.execute("SELECT * FROM YOUR_TABLE_NAME")
    # finally:
    #     db.close()
    print packet[1:][:70].split(",")