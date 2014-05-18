package com.summithill.ultimate.controller;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.summithill.ultimate.model.Player;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ParameterPlayer implements Comparable<ParameterPlayer> {
	private String name;
	private String number;
	private String position;
	private boolean isMale;
	private String leaguevinePlayer;
	private boolean isInactive;
	
	public static ParameterPlayer fromPlayer(Player player) {
		ParameterPlayer pPlayer = new ParameterPlayer();
		pPlayer.setMale(player.isMale());
		pPlayer.setName(player.getName());
		pPlayer.setNumber(player.getNumber());
		pPlayer.setPosition(player.getPosition());
		pPlayer.setLeaguevinePlayer(player.getLeaguevinePlayerJson());
		return pPlayer;
	}
	
	public void copyToPlayer(Player modelPlayer) {
		modelPlayer.setName(name);
		modelPlayer.setNumber(number);
		modelPlayer.setPosition(position);
		modelPlayer.setIsMale(isMale);
		modelPlayer.setLeaguevinePlayerJson(leaguevinePlayer);
	}
	
	public static ParameterPlayer createInactivePlayer(String name) {
		ParameterPlayer pPlayer = new ParameterPlayer();
		pPlayer.setName(name);
		pPlayer.setInactive(true);
		return pPlayer;
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

	public String getLeaguevinePlayer() {
		return leaguevinePlayer;
	}

	public void setLeaguevinePlayer(String leaguevinePlayer) {
		this.leaguevinePlayer = leaguevinePlayer;
	}

	public boolean isInactive() {
		return isInactive;
	}

	public void setInactive(boolean isInactive) {
		this.isInactive = isInactive;
	}
	
	@Override
	public int compareTo(ParameterPlayer otherPlayer) {
		return this.getName().compareToIgnoreCase(otherPlayer.getName());
	}

	@Override
	public int hashCode() {
		return name == null ? 0  : name.hashCode();
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ParameterPlayer other = (ParameterPlayer) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equalsIgnoreCase(other.name))
			return false;
		return true;
	}

}
