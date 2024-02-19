package com.summithill.ultimate.model.lightweights;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown=true)
public class EventDetails {
	public static String HANGTIME = "hangtime";
	
	private int hangtime; // milliseconds

	public int getHangtime() {
		return hangtime;
	}

	public void setHangtime(int hangtime) {
		this.hangtime = hangtime;
	}

}
