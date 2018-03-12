import java.util.List;

import com.example.dao.DAOFactory;
import com.example.dao.sensorDataDAO;
import com.example.model.sensorData;

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
public class DAOTest {
	
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
}
