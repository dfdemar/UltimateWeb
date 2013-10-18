package com.summithill.ultimate.controller;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterMetaInfo {
	private boolean isAppVersionAcceptable= true;
	private String messageToUser = "";
	
	public boolean isAppVersionAcceptable() {
		return isAppVersionAcceptable;
	}
	public void setAppVersionAcceptable(boolean isAppVersionAcceptable) {
		this.isAppVersionAcceptable = isAppVersionAcceptable;
	}
	public String getMessageToUser() {
		return messageToUser;
	}
	public void setMessageToUser(String messageToUser) {
		this.messageToUser = messageToUser;
	}

}
