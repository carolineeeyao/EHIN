import serial
import MySQLdb
import datetime


ser = serial.Serial('/dev/tty.usbmodemL2000IS1', 9600)
ser.readline()
db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="password",  # your password
                     db="SeniorDesign")        # name of the data base
cur = db.cursor()

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

while True:
    packet = ser.readline()
    print packet
    print len(packet)
    try:
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
        i) = packet[1:].split(",")
    except:
        continue
    i = int(i[:1])

    timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
    lux = int(m) * (0.01 * (2 ** int(e)))

    addToGraphDatabase("Temperature", g_s32ActualTemp, i, timestamp)
    addToGraphDatabase("Humidity", g_u32ActualHumity, i, timestamp)
    addToGraphDatabase("Pressure", g_u32ActualPress, i, timestamp)
    addToGraphDatabase("LightIntensity", lux, i, timestamp)
    addToTableDatabase("Accelerometer", s_accelXYZ_x, s_accelXYZ_y, s_accelXYZ_z, i, timestamp)
    addToTableDatabase("Gyroscope", s_gyroXYZ_x, s_gyroXYZ_y, s_gyroXYZ_z, i, timestamp)
    addToTableDatabase("MagneticForce", s_magcompXYZ_x, s_magcompXYZ_y, s_magcompXYZ_z, i, timestamp)

    #sql = "insert into Humidity(Txid, Value, TimeRead) Values (1, {}, '1970-01-01 00:00:01')".format(g_u32ActualHumity)
    #try:
       
        #cur.execute("SELECT * FROM Temperature limit 5")
        #cur.execute(sql)
        #db.commit()

        #print cur.fetchall()
    #except e:
        #print e
   