package com.example.dao;

import static com.example.dao.DAOUtil.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.example.model.sensorData;

public class sensorDataDAOJDBC  implements sensorDataDAO {
	private static final String SQL_FIND_BY_ID = 
			"SELECT id, txid, timestamp, temperature, luminosity FROM sensorData WHERE id = ?";
	private static final String SQL_FIND_BY_TXID_AND_TIMESTAMP = 
			"SELECT id, txid, timestamp, temperature, luminosity FROM sensorData WHERE txid = ? AND timestamp = ?";
	private static final String SQL_LIST_ORDER_BY_ID = 
			"SELECT id, txid, timestamp, temperature, luminosity FROM sensorData ORDER BY id";
	private static final String SQL_INSERT = 
			"INSERT INTO sensorData (txid, timestamp, temperature, luminosity) VALUES (?, ?, ?, ?)";
	private static final String SQL_UPDATE = 
			"UPDATE sensorData SET txid = ?, timestamp = ?, temperature = ?, luminosity = ? WHERE id = ?";
	private static final String SQL_DELETE = 
			"DELETE FROM sensorData WHERE id = ?";
	private static final String SQL_EXIST_TXID = 
			"SELECT id FROM sensorData WHERE txid = ?";
	
	private DAOFactory daoFactory;
	
	sensorDataDAOJDBC(DAOFactory daoFactory) {
		this.daoFactory = daoFactory;
	}
	
	@Override
	public sensorData find(Long id) throws DAOException {
		return find(SQL_FIND_BY_ID, id);
	}
	
	@Override
	public sensorData find(Long txid, String timestamp) throws DAOException {
		return find(SQL_FIND_BY_TXID_AND_TIMESTAMP, txid, timestamp);
	}
	
	private sensorData find(String sql, Object... values) throws DAOException {
		sensorData data = null;
		
		try(
			Connection connection = daoFactory.getConnection();
			PreparedStatement statement = prepareStatement(connection, sql, false, values);
			ResultSet resultSet = statement.executeQuery();
		) {
			if (resultSet.next()) {
				data = map(resultSet);
			}
		} catch (SQLException e) {
			throw new DAOException(e);
		}
		
		return data;
	}
	
	@Override
	public List<sensorData> list() throws DAOException {
		List<sensorData> data = new ArrayList<>();
		
		try (
			Connection connection = daoFactory.getConnection();
			PreparedStatement statement = connection.prepareStatement(SQL_LIST_ORDER_BY_ID);
			ResultSet resultSet = statement.executeQuery();
		) {
			while (resultSet.next()) {
				data.add(map(resultSet));
			}
		} catch (SQLException e) {
			throw new DAOException(e);
		}
		
		return data;
	}
	
	@Override
	public void create(sensorData data) throws IllegalArgumentException, DAOException {
		if(data.getId() != null) {
			throw new IllegalArgumentException("Data is already created, the data ID is not null");
		}
		
		Object[] values = {
			data.getTxid(),
			data.getTimeStamp(),
			data.getTemperature(),
			data.getLuminosity()
		};
		
		try (
			Connection connection = daoFactory.getConnection();
			PreparedStatement statement = prepareStatement(connection, SQL_INSERT, true, values);
		) {
			int affectedRows = statement.executeUpdate();
			if(affectedRows == 0) {
				throw new DAOException("Creating data failed, no rows affected.");
			}
			
			try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
				if(generatedKeys.next()) {
					data.setId(generatedKeys.getLong(1));
				}
				else {
					throw new DAOException("Creating data failed, no generated key obtained.");
				}
			}
		} catch (SQLException e) {
			throw new DAOException(e);
		}
	}
	
	@Override
	public void update(sensorData data) throws DAOException {
		if(data.getId() == null) {
			throw new IllegalArgumentException("Data is not created yet, the data ID is null.");
		}
		
		Object[] values = {
			data.getTxid(),
			data.getTimeStamp(),
			data.getTemperature(),
			data.getLuminosity(),
			data.getId()
		};
		
		try (
			Connection connection = daoFactory.getConnection();
			PreparedStatement statement = prepareStatement(connection, SQL_UPDATE, false, values);
		) {
			int affectedRows = statement.executeUpdate();
			if(affectedRows == 0) {
				throw new DAOException("Updating data failed, no rows affected.");
			}
		} catch (SQLException e) {
			throw new DAOException(e);
		}
	}
	
	@Override
	public void delete(sensorData data) throws DAOException {
		Object[] values = {
			data.getId()
		};
		
		try (
			Connection connection = daoFactory.getConnection();
			PreparedStatement statement = prepareStatement(connection, SQL_DELETE, false, values);
		) {
			int affectedRows = statement.executeUpdate();
			if(affectedRows == 0) {
				throw new DAOException("Deleting data failed, no rows affected.");
			}
			else {
				data.setId(null);
			}
		} catch (SQLException e) {
			throw new DAOException(e);
		}
	}
	
	@Override
	public boolean existTxid(Long txid) throws DAOException {
		Object[] values = {
			txid
		};
		
		boolean exist = false;
		
		try (
			Connection connection = daoFactory.getConnection();
			PreparedStatement statement = prepareStatement(connection, SQL_EXIST_TXID, false, values);
			ResultSet resultSet = statement.executeQuery();
		) {
			exist = resultSet.next();
		} catch (SQLException e) {
			throw new DAOException(e);
		}
		
		return exist;
	}
	
	// Helpers
	private static sensorData map(ResultSet resultSet) throws SQLException {
		sensorData data = new sensorData();
		data.setId(resultSet.getLong("id"));
		data.setTxid(resultSet.getLong("txid"));
		data.setTimeStamp(resultSet.getString("timestamp"));
		data.setTemperature(resultSet.getString("temperature"));
		data.setLuminosity(resultSet.getString("luminosity"));
		return data;
	}
}
