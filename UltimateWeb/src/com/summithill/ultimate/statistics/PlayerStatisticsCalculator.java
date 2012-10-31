package com.summithill.ultimate.statistics;

import static com.summithill.ultimate.model.lightweights.PointSummary.O_LINE;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import com.summithill.ultimate.controller.MobileRestController;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.Point;
import com.summithill.ultimate.service.TeamService;

public class PlayerStatisticsCalculator extends AbstractStatisticsCalculator {
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
	private Map<String, PlayerStats> stats = new HashMap<String, PlayerStats>();;
	
	public PlayerStatisticsCalculator(TeamService service) {
		super(service);
	}
	
	public Collection<PlayerStats> calculateStats(Team team, List<String> gameIds) {

		for (String gameId : gameIds) {
			Game game = getGame(team, gameId);
			updateStatsForGame(game);
		}
		
		return stats.values();
	}
	
	public Collection<PlayerStats> getStats() {
		return stats.values();
	}
	
	public void updateStatsForGame(Game game) {
		Set<String> playedInGame = new HashSet<String>();
		List<Point> points = game.getPoints();
		for (Point point : points) {
			updatePointsPlayedStats(point, playedInGame);
			List<Event> events = point.getEvents();
			Event lastEvent = null;
			for (Event event : events) {
				PlayerStats passer = event.isOffense() ? getStats(event.getPasser()) : null;
				PlayerStats receiver = event.isOffense() ? getStats(event.getReceiver()) : null;
				PlayerStats defender = event.isDefense() ? getStats(event.getDefender()) : null;
				if (event.isCatch()) {
					passer.incPasses();
					receiver.incCatches();
					receiver.incTouches();
					if (event.isFirstOffenseEvent(lastEvent)) {
						passer.incTouches();
					}
				} else if (event.isDrop()) {
					passer.incPasses();
					receiver.incDrops();
					receiver.decPlusMinusCount();
					if (event.isFirstOffenseEvent(lastEvent)) {
						passer.incTouches();
					}
				} else if (event.isOffense() && event.isThrowaway()) {
					passer.incPasses();
					passer.incThrowaways();
					passer.decPlusMinusCount();
					if (event.isFirstOffenseEvent(lastEvent)) {
						passer.incTouches();
					}
				} else if (event.isPull()) {
					int hangtimeMilliseconds = event.getDetails() == null ? 0 : event.getDetails().getHangtime();
					defender.incPulls(hangtimeMilliseconds);		
				} else if (event.isPullOb()) {
					defender.incPullOBs();		
				} else if (event.isD()) {
					defender.incDs();
					defender.incPlusMinusCount();
				} else if (event.isGoal() && event.isOffense()) {
					passer.incAssists();
					passer.incPasses();
					receiver.incTouches();
					receiver.incGoals();
					passer.incPlusMinusCount();
					receiver.incPlusMinusCount();
					if (event.isFirstOffenseEvent(lastEvent)) {
						passer.incTouches();
					}
				}
				if (event.isOffense() && passer.getPasses() > 0) {
					float passPercent = ((float)passer.getPasses() - (float)passer.getThrowaways()) / (float)passer.getPasses() * 100f;
					passer.setPassSuccess((int)(passPercent));
				}
				if (event.isOffense() && receiver.getCatches() > 0) {
					float catchPercent = ((float)receiver.getCatches() - (float)receiver.getDrops()) / (float)receiver.getCatches() * 100f;
					receiver.setCatchSuccess((int)(catchPercent));	
				}
				lastEvent = event;
			}
			if (point.getLine() != null) {
				for (String name : point.getLine()) {
					PlayerStats playerStats = getStats(name);
					playerStats.addSecondsPlayed(point.getSummary().getElapsedTime());
				}
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
				if (O_LINE.equals(point.getSummary().getLineType())) {
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
	

}
