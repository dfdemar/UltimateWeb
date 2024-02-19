package com.summithill.ultimate.controller;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ParameterPlayerTest {
	private ParameterPlayer player;
	
	public static ParameterPlayer createTestPlayer() {
		ParameterPlayer player = new ParameterPlayer();
		player.setMale(true);
		player.setName("Joe");
		player.setNumber("2");
		player.setPosition("Cutter");
		return player;
	}
	
	@Before
	public void setup() {
		player = createTestPlayer();
	}
	
	@Test
	public void testMarshalling() throws Exception {
		String json = new ObjectMapper().writeValueAsString(player);
		System.out.println(json);
		ParameterPlayer unmarshalledPlayer = new ObjectMapper().readValue(json, ParameterPlayer.class);
		assertEquals(player.getName(), unmarshalledPlayer.getName());
		assertEquals(player.getNumber(), unmarshalledPlayer.getNumber());
		assertEquals(player.isMale(), unmarshalledPlayer.isMale());
		assertEquals(player.getPosition(), unmarshalledPlayer.getPosition());
	}
}
