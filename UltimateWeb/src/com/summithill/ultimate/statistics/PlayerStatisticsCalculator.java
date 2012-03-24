package com.summithill.ultimate.statistics;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.Point;
import com.summithill.ultimate.service.TeamService;

public class PlayerStatisticsCalculator {
	private TeamService service;
	private Map<String, PlayerStats> stats;
	
	public PlayerStatisticsCalculator(TeamService service) {
		super();
		this.service = service;
	}
	
	public Collection<PlayerStats> calculateStats(Team team, List<String> gameIds) {
		stats = new HashMap<String, PlayerStats>();
		
		for (String gameId : gameIds) {
			Game game = getGame(team, gameId);
			updateStatsForGame(game);
		}
		
		return stats.values();
	}
	
	private void updateStatsForGame(Game game) {
		Set<String> playedInGame = new HashSet<String>();
		List<Point> points = game.getPoints();
		Collections.reverse(points);
		for (Point point : points) {
			updatePointsPlayedStats(point, playedInGame);
			List<Event> events = point.getEvents();
			Collections.reverse(events);
			boolean firstEvent = true;
			Event lastEvent = null;
			for (Event event : events) {
				if (event.getAction().equals("Catch")) {
					getStats(event.getPasser()).incPasses();
					getStats(event.getReceiver()).incCatches();
					getStats(event.getReceiver()).incTouches();
					if (firstEvent || (lastEvent !=null && lastEvent.getAction().equals("D"))) {
						getStats(event.getPasser()).incTouches();
					}
				} else if (event.getAction().equals("Drop")) {
					getStats(event.getPasser()).incPasses();
					getStats(event.getReceiver()).incDrops();
				} else if (event.getAction().equals("Throwaway")) {
					getStats(event.getPasser()).incThrowaways();
				} else if (event.getAction().equals("Pull")) {
					getStats(event.getDefender()).incPulls();					
				} else if (event.getAction().equals("D")) {
					getStats(event.getDefender()).incDs();
				} else if (event.getAction().equals("Goal") && event.getType().equals("Offense")) {
					getStats(event.getPasser()).incAssists();
					getStats(event.getReceiver()).incTouches();
					getStats(event.getReceiver()).incGoals();
				}
				firstEvent = false;
				lastEvent = event;
			}
			for (String name : playedInGame) {
				PlayerStats playerStats = getStats(name);
				playerStats.addSecondsPlayed(point.getSummary().getElapsedTime());
			}
		}
		for (String name : playedInGame) {
			PlayerStats playerStats = getStats(name);
			playerStats.incGamesPlayed();
		}
	}

	private void updatePointsPlayedStats(Point point, Set<String> playedInGame ) {
		if (point.getLine() != null) {
			for (String name : point.getLine()) {
				playedInGame.add(name);
				PlayerStats playerStats = getStats(name);
				playerStats.incPointsPlayed();
				if ("O".equals(point.getSummary().getLineType())) {
					playerStats.incOPointsPlayed();
				} else {
					playerStats.incDPointsPlayed();
				}
			}
		}
	}

	private PlayerStats getStats(String playerName) {
		PlayerStats playerStats = stats.get(playerName) ;
		if (playerStats == null) {
			playerStats = new PlayerStats(playerName);
			stats.put(playerName, playerStats);
		}
		return playerStats;
	}
	
	private Game getGame(Team team, String gameId) {
		return service.getGame(team, gameId);
	}
}
