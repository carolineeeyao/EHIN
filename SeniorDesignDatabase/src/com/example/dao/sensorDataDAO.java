package com.example.dao;

import java.util.List;
import com.example.model.sensorData;

public interface sensorDataDAO {
	public sensorData find(Long id) throws DAOException;
	
	public sensorData find(Long txid, String timestamp) throws DAOException;
	
	public List<sensorData> list() throws DAOException;
	
	public void create(sensorData data) throws IllegalArgumentException, DAOException;
	
	public void update(sensorData data) throws IllegalArgumentException, DAOException;
	
	public void delete(sensorData data) throws DAOException;
	
	public boolean existTxid(Long txid) throws DAOException;
}
