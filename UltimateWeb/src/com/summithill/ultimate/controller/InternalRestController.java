package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.net.HttpURLConnection;
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
		String url = updateEvent.getNotifyUrlWithTeamAndGameParameters();		
		try {
			HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
			int responseCode = con.getResponseCode();
			if (responseCode != 200) {
				log.log(SEVERE, "Unable to notify game listener due to HTTP request error to URL " + url + ". HTTP response code was " + responseCode + ". Notify event skipped.");
			}
		} catch (Exception e) {
			log.log(SEVERE, "Unable to notify game listener due to HTTP request error to URL " + url + ". Notify event skipped", e);
		}
	}

}


