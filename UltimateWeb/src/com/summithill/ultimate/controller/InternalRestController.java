package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.summithill.ultimate.model.GameUpdateEvent;

@Controller
@RequestMapping("/internal")
public class InternalRestController extends AbstractController {
	
	@RequestMapping(value = "/notify-game-update-listeners", method = RequestMethod.GET)
	@ResponseBody
	public void notifyGameUpdateListeners() {
		// retrieve all of the game notifications
		List<GameUpdateEvent> updateEvents = service.getAllGamesUpdateEvents();
		
		// reduce the duplicates (can be more than one event for a game)
		Map<String, GameUpdateEvent> gamesHashMap = new HashMap<String, GameUpdateEvent>();
		for (GameUpdateEvent gameUpdateEvent : updateEvents) {
			gamesHashMap.put(gameUpdateEvent.getGameId(), gameUpdateEvent);
		}
		
		// for each game...notify
		for (GameUpdateEvent gameUpdateEvent : gamesHashMap.values()) {
			notifyGameUpdateListener(gameUpdateEvent);
		}
		
		// remove all of the notification events
		for (GameUpdateEvent gameUpdateEvent : updateEvents) {
			service.deleteGameUpdateEvent(gameUpdateEvent);
		}
	}
	
	private void notifyGameUpdateListener(GameUpdateEvent updateEvent) {
		try {
		    URL url = new URL(updateEvent.getNotifyUrl());
		    BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
		    reader.readLine();
		    reader.close();
		} catch (Exception e) {
			log.log(SEVERE, "Unable to notify game listener due to HTTP request error to URL " + updateEvent.getNotifyUrl() + ". Notify event skipped", e);
		}
	}

}


