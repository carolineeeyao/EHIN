import serial
import MySQLdb

ser = serial.Serial('/dev/tty.usbmodemL2000IS1', 9600)
ser.readline()
db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="password",  # your password
                     db="SeniorDesign")        # name of the data base
cur = db.cursor()
while True:
    packet = ser.readline()
    try:
        with db.cursor() as cur:
            cur.execute("SELECT * FROM YOUR_TABLE_NAME")
    finally:
        db.close()
    print packet