package com.example.dao;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public abstract class DAOFactory {
	private static final String PROPERTY_URL = "url";
	private static final String PROPERTY_DRIVER = "driver";
	private static final String PROPERTY_USERNAME = "username";
	private static final String PROPERTY_PASSWORD = "password";
	
	// Actions
	public static DAOFactory getInstance(String name) throws DAOConfigurationException {
		if(name == null) {
			throw new DAOConfigurationException("Database name is null.");
		}
		
		DAOProperties properties = new DAOProperties(name);
		String url = properties.getProperty(PROPERTY_URL, true);
		String driverClassName = properties.getProperty(PROPERTY_DRIVER, false);
		String password = properties.getProperty(PROPERTY_PASSWORD, false);
		String username = properties.getProperty(PROPERTY_USERNAME, password != null);
		DAOFactory instance;
		
		// If driver is specified, then load it to let it register itself with DriverManager.
		if(driverClassName != null) {
			try {
				Class.forName(driverClassName);
			} catch (ClassNotFoundException e) {
				throw new DAOConfigurationException("Driver class '" + driverClassName + "' is missing in classpath.", e);
			}
			instance = new DriverManagerDAOFactory(url, username, password);
		}
		
		// Else assumes URL as DataSource URL and lookup it in the JNDI
		else {
			DataSource dataSource;
			try {
				dataSource = (DataSource) new InitialContext().lookup(url);
			} catch (NamingException e) {
				throw new DAOConfigurationException("DataSource '" + url + "' is missing in JNDI.", e);
			}
			if(username != null) {
				instance = new DataSourceWithLoginDAOFactory(dataSource, username, password);
			}
			else {
				instance = new DataSourceDAOFactory(dataSource);
			}
		}
		
		return instance;
	}
	
	abstract Connection getConnection() throws SQLException;
	
	public sensorDataDAO getSensorDataDAO() {
		return new sensorDataDAOJDBC(this);
	}	
}

// Default DAOFactory implementations

class DriverManagerDAOFactory extends DAOFactory {
	private String url;
	private String username;
	private String password;
	
	DriverManagerDAOFactory(String url, String username, String password) {
		this.url = url;
		this.username = username;
		this.password = password;
	}
	
	@Override
	Connection getConnection() throws SQLException {
		return DriverManager.getConnection(url, username, password);
	}
}

class DataSourceDAOFactory extends DAOFactory {
	private DataSource dataSource;
	
	DataSourceDAOFactory(DataSource dataSource) {
		this.dataSource = dataSource;
	}
	
	@Override
	Connection getConnection() throws SQLException {
		return dataSource.getConnection();
	}
}

class DataSourceWithLoginDAOFactory extends DAOFactory {
	private DataSource dataSource;
	private String username;
	private String password;
	
	DataSourceWithLoginDAOFactory(DataSource dataSource, String username, String password) {
		this.dataSource = dataSource;
		this.username = username;
		this.password = password;
	}
	
	@Override
	Connection getConnection() throws SQLException {
		return dataSource.getConnection(username, password);
	}
}