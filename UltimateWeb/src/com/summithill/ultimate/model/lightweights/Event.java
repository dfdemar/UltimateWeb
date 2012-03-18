package com.summithill.ultimate.model.lightweights;

public class Event {
	private String type;
	private String action;
	private String defender;
	private String passer;
	private String receiver;
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getDefender() {
		return defender;
	}
	public void setDefender(String defender) {
		this.defender = defender;
	}
	public String getPasser() {
		return passer;
	}
	public void setPasser(String passer) {
		this.passer = passer;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String reciever) {
		this.receiver = reciever;
	}
}
