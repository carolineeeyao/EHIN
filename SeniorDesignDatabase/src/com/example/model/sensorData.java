package com.example.model;
import java.io.Serializable;

public class sensorData implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private Long txid;
	private String timestamp;
	private String temperature;
	private String luminosity;
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getTxid() {
		return txid;
	}
	
	public void setTxid(Long txid) {
		this.txid = txid;
	}
	
	public String getTimeStamp() {
		return timestamp;
	}
	
	public void setTimeStamp(String timestamp) {
		this.timestamp = timestamp;
	}
	
	public String getTemperature() {
		return temperature;
	}
	
	public void setTemperature(String temperature) {
		this.temperature = temperature;
	}
	
	public String getLuminosity() {
		return luminosity;
	}
	
	public void setLuminosity(String luminosity) {
		this.luminosity = luminosity;
	}
	
	// Compares by unique ID
	@Override
	public boolean equals(Object other) {
		return (other instanceof sensorData) && (id != null) ? id.equals(((sensorData) other).id) : (other == this); 
	}
	
	@Override
	public int hashCode() {
		return (id != null) ? (this.getClass().hashCode() + id.hashCode()) : super.hashCode();
	}
	
	@Override
	public String toString() {
		return String.format("sensorData[id=%d,txid=%d,timestamp=%s,temperature=%s,luminosity=%s]", id, txid, timestamp, temperature, luminosity);
	}
}
