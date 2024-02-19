package com.summithill.ultimate.controller;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ParameterTeamTest {
	private ParameterTeam team;
	
	public static ParameterTeam createTestTeam() {
		ParameterTeam team = new ParameterTeam();
		team.setName("Hodags");
		team.setMixed(true);
		ArrayList<ParameterPlayer> players = new ArrayList<ParameterPlayer>();
		team.setPlayers(players);
		players.add(ParameterPlayerTest.createTestPlayer());
		ParameterPlayer parameterPlayer = ParameterPlayerTest.createTestPlayer();
		parameterPlayer.setName("Tom");
		players.add(parameterPlayer);
		return team;
	}
	
	@Before
	public void setup() {
		team = createTestTeam();
	}
	
	@Test
	public void testMarshalling() throws Exception {
		String json = new ObjectMapper().writeValueAsString(team);
		System.out.println(json);
		ParameterTeam unmarshalledTeam = new ObjectMapper().readValue(json, ParameterTeam.class);
		assertEquals(team.getName(), unmarshalledTeam.getName());
		assertEquals(2, unmarshalledTeam.getPlayers().size());
		assertEquals(team.getPlayers().get(0).getName(), unmarshalledTeam.getPlayers().get(0).getName());
	}
}
