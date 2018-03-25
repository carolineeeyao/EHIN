import serial
import pymysql.cursors

ser = serial.Serial('/dev/tty.usbmodemL2000IS1', 9600)
ser.readline()
connection = pymysql.connect(host='localhost',
                             user='user',
                             password='passwd',
                             db='db',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
while True:
    packet = ser.readline()
    try:
        with connection.cursor() as cursor:
            # Create a new record
            sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
            cursor.execute(sql, ('webmaster@python.org', 'very-secret'))
    finally:
        connection.close()
    print packet