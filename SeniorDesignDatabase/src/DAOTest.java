import java.util.List;

import com.example.dao.DAOFactory;
import com.example.dao.sensorDataDAO;
import com.example.model.sensorData;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import gnu.io.CommPortIdentifier;
import gnu.io.SerialPort;
import gnu.io.SerialPortEvent;
import gnu.io.SerialPortEventListener;
import java.util.Enumeration;

/*
 * PreConditions:
 * A MySQL server running at localhost:3306 with a database named 'javabase'.
 * A 'sensorData' table in the 'javabase' database which is created as follows:
 * 
 * CREATE TABLE javabase.sensorData (
 * 		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 * 		txid BIGINT UNSIGNED NOT NULL,
 * 		timestamp VARCHAR(60) NOT NULL,
 * 		temperature VARCHAR(32) NOT NULL,
 * 		luminosity VARCHAR(32) NOT NULL,
 * 
 * 		PRIMARY KEY(id)
 * )
 * 
 * A MySQL user with the name 'java' and password 'password' which has sufficient rights on
 * the javabase.sensorData table.
 * 
 * A MySQL JDBC Driver JAR file in the classpath.
 * A properties file 'dao.properties' in the classpath with the following entries:
 * 
 * javabase.jdbc.driver = com.mysql.jdbc.Driver
 * javabase.jdbc.url = jdbc:mysql://localhost:3306/javabase
 * javabase.jdbc.username = java
 * javabase.jdbc.password = password
 * 
 */
public class DAOTest implements SerialPortEventListener {
	
	SerialPort serialPort;
	
	private static final String PORT_NAMES[] = {
			"/dev/tty.usbserial-A9007UX1", // Mac OS X
            "/dev/ttyACM0", // Raspberry Pi
            "/dev/ttyUSB0", // Linux
            "COM3", // Windows	
	};
	
	private BufferedReader input;
	
	private static final int TIME_OUT = 2000;
	
	private static final int DATA_RATE = 9600;
	
	public void initialize() {
		// the next line is for Raspberry Pi and
		// gets us into the while loop and was suggested here was suggested
		// http://www.raspberrypi.org/phpBB3/viewtopic.php?f=81&t=32186
		System.setProperty("gnu.io.rxtx.SerialPorts", "/dev/ttyACM0");

		CommPortIdentifier portId = null;
		Enumeration portEnum = CommPortIdentifier.getPortIdentifiers();

		// First, Find an instance of serial port as set in PORT_NAMES.
		while (portEnum.hasMoreElements()) {
			CommPortIdentifier currPortId = (CommPortIdentifier) portEnum.nextElement();
			for (String portName : PORT_NAMES) {
				if (currPortId.getName().equals(portName)) {
					portId = currPortId;
					break;
				}
			}
		}
		if (portId == null) {
			System.out.println("Could not find COM port.");
			return;
		}

		try {
			// open serial port, and use class name for the appName.
			serialPort = (SerialPort) portId.open(this.getClass().getName(), TIME_OUT);

			// set port parameters
			serialPort.setSerialPortParams(DATA_RATE, SerialPort.DATABITS_8, SerialPort.STOPBITS_1,
					SerialPort.PARITY_NONE);

			// open the streams
			input = new BufferedReader(new InputStreamReader(serialPort.getInputStream()));

			// add event listeners
			serialPort.addEventListener(this);
			serialPort.notifyOnDataAvailable(true);
		} catch (Exception e) {
			System.err.println(e.toString());
		}
	}
	
	/**
	 * This should be called when you stop using the port.
	 * This will prevent port locking on platforms like Linux.
	 */
	public synchronized void close() {
		if (serialPort != null) {
			serialPort.removeEventListener();
			serialPort.close();
		}
	}

	/**
	 * Handle an event on the serial port. Read the data and print it.
	 */
	public synchronized void serialEvent(SerialPortEvent oEvent) {
		if (oEvent.getEventType() == SerialPortEvent.DATA_AVAILABLE) {
			try {
				String inputLine=input.readLine();
				System.out.println(inputLine);
			} catch (Exception e) {
				System.err.println(e.toString());
			}
		}
		// Ignore all the other eventTypes, but you should consider the other ones.
	}
	
	public static void main(String[] args) throws Exception {
		DAOTest main = new DAOTest();
		main.initialize();
		Thread t=new Thread() {
			public void run() {
				//the following line will keep this app alive for 1000 seconds,
				//waiting for events to occur and responding to them (printing incoming messages to console).
				try {Thread.sleep(1000000);} catch (InterruptedException ie) {}
			}
		};
		t.start();
		System.out.println("Started");
	}
	
	/*
	public static void main(String[] args) throws Exception {
		//Obtain DAOFactory
		DAOFactory javabase = DAOFactory.getInstance("javabase.jdbc");
		System.out.println("DAOFactory successfully obtained: " + javabase);
		
		//Obtain sensorDataDAO
		sensorDataDAO sensordataDAO = javabase.getSensorDataDAO();
		System.out.println("sensorDataDAO successfully obtained: " + sensordataDAO);
		
		//Create sensorData
		sensorData data = new sensorData();
		data.setTxid(1L);
		data.setTimeStamp("12:31");
		data.setTemperature("69F");
		data.setLuminosity("200lux");
		sensordataDAO.create(data);
		System.out.println("sensorData successfully created: " + data);
		
		
		//Create another sensorData
		sensorData anotherData = new sensorData();
		anotherData.setTxid(2L);
		anotherData.setTimeStamp("20:11");
		anotherData.setTemperature("72F");
		anotherData.setLuminosity("100lux");
		sensordataDAO.create(anotherData);
		System.out.println("Another sensorData successfully created: " + anotherData);
		
		//Update sensorData
		data.setTemperature("60F");
		data.setLuminosity("50lux");
		sensordataDAO.update(data);
		System.out.println("sensorData successfully updated: " + data);
		
		//List all sensorData
		List<sensorData> dataList = sensordataDAO.list();
		System.out.println("List of sensorData successfully queried: " + dataList);
		System.out.println("Thus, amount of users in database is: " + dataList.size());
		
		//Delete sensorData
		//sensordataDAO.delete(data);
		//System.out.println("sensorData successfully deleted: " + data);
		
		//Check if Txid exists
		boolean exist = sensordataDAO.existTxid(1L);
		System.out.println("This Txid should not exist anymore, so this should print false: " + exist);
		
		//Check if Txid exists for anotherData
		boolean exist2 = sensordataDAO.existTxid(2L);
		System.out.println("This Txid should exist, so this should print true: " + exist2);
		
		//Get another data by Txid and Timestamp
		sensorData foundAnotherData = sensordataDAO.find(2L, "20:11");
		System.out.println("Another sensorData successfully queried with Txid and Timestamp: " + foundAnotherData);
		
		//Delete another data
		//sensordataDAO.delete(foundAnotherData);
		//System.out.println("Another sensorData successfully deleted: " + foundAnotherData);
		
		//List all sensorData again
		dataList = sensordataDAO.list();
		System.out.println("List of sensorData successfully queried: " + dataList);
		System.out.println("Thus, amount of users in database is: " + dataList.size());
	}
	*/
}
