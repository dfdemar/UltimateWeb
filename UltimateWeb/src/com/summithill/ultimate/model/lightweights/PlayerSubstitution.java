package com.summithill.ultimate.model.lightweights;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown=true)
public class PlayerSubstitution {
	public static final String SUBSTITUTION_REASON_INJURY = "injury";
	public static final String SUBSTITUTION_REASON_OTHER = "other";
	
	private String fromPlayer;
	private String toPlayer;
	private String reason;
	private double timestamp;  // seconds since epoch
	
	public String getFromPlayer() {
		return fromPlayer;
	}
	public void setFromPlayer(String fromPlayer) {
		this.fromPlayer = fromPlayer;
	}
	public String getToPlayer() {
		return toPlayer;
	}
	public void setToPlayer(String toPlayer) {
		this.toPlayer = toPlayer;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public double getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(double timestamp) {
		this.timestamp = timestamp;
	}
	@JsonIgnore
	public void renamePlayer(String oldPlayerName, String newPlayerName) {
		if (this.fromPlayer != null && this.fromPlayer.equalsIgnoreCase(oldPlayerName)) {
			this.fromPlayer = newPlayerName;
		}
		if (this.toPlayer != null && this.toPlayer.equalsIgnoreCase(oldPlayerName)) {
			this.toPlayer = newPlayerName;
		}
	}
}
