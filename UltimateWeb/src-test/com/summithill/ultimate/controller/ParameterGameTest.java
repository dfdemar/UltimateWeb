package com.summithill.ultimate.controller;

import static org.junit.Assert.assertNotNull;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

public class ParameterGameTest {
	
	@Before
	public void setup() {
	}
	
	@Test
	public void testUnMarshalling() throws Exception {
		String json = "{\"tournamentName\":\"trouble at vegas\",\"opponentName\":\"foos\",\"ours\":1103100,\"gameId\":\"game-613E90F4-1CDC-48C2-8E1B-CDE8D346D0E3\",\"gamePoint\":13,\"timestamp\":\"2012-04-15 20:53\",\"isFirstPointOline\":false,\"wind\":{\"mph\":0,\"leftToRight\":true,\"degrees\":-1},\"teamId\":\"4936\",\"theirs\":534643}";
		ParameterGame unmarshalledGame = new ObjectMapper().readValue(json, ParameterGame.class);
		assertNotNull(unmarshalledGame);
	}
}
