package com.summithill.ultimate.controller;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.summithill.ultimate.model.Player;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterPlayer {
	private String name;
	private String number;
	private String position;
	private boolean isMale;
	
	public static ParameterPlayer fromPlayer(Player player) {
		ParameterPlayer pPlayer = new ParameterPlayer();
		pPlayer.setMale(player.isMale());
		pPlayer.setName(player.getName());
		pPlayer.setNumber(player.getNumber());
		pPlayer.setPosition(player.getPosition());
		return pPlayer;
	}
	
	public void copyToPlayer(Player modelPlayer) {
		modelPlayer.setName(name);
		modelPlayer.setNumber(number);
		modelPlayer.setPosition(position);
		modelPlayer.setIsMale(isMale);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public boolean isMale() {
		return isMale;
	}

	public void setMale(boolean isMale) {
		this.isMale = isMale;
	}
}
