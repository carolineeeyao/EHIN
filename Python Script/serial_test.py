import serial
import pymysql.cursors

ser = serial.Serial('/dev/tty.usbmodemL2000IS1', 9600)#open serial port
#ser.readline()#first read starts in the middle of a packet so throw it out
# connection = pymysql.connect(host='localhost',
#                              user='user',
#                              password='passwd',
#                              db='db',
#                              charset='utf8mb4',
#                              cursorclass=pymysql.cursors.DictCursor)
i = 0
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
	print i
	i += 1