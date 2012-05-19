package com.summithill.ultimate.statistics;

import static com.summithill.ultimate.model.lightweights.Event.DROP;
import static com.summithill.ultimate.model.lightweights.Event.THROWAWAY;

import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import com.summithill.ultimate.controller.MobileRestController;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.Point;
import com.summithill.ultimate.service.TeamService;

public class TeamStatisticsCalculator extends AbstractStatisticsCalculator {
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
	private TeamStats teamStats;
	
	public TeamStatisticsCalculator(TeamService service) {
		super(service);
	}
	
	public TeamStats calculateStats(Team team, List<String> gameIds) {
		teamStats = new TeamStats();
		
		for (String gameId : gameIds) {
			Game game = getGame(team, gameId);
			updateStatsForGame(game);
		}
		
		return teamStats;
	}
	
	private void updateStatsForGame(Game game) {
		TrendPoint gameTrendPoint = teamStats.addNewTrendPoint();
		List<Point> points = game.getPoints();
		Collections.reverse(points);
		Point lastPoint = null;
		for (Point point : points) {
			List<Event> events = point.getEvents();
			Event lastEvent = null;
			for (Event event : events) {
				int touches = calculateTouches(event, lastEvent);
				updateGoalSummary(teamStats.getGoalSummary(), point, lastPoint, event, lastEvent);
				updateTrend(gameTrendPoint, point, lastPoint, event, lastEvent, touches);
				lastEvent = event;
			}
			lastPoint = point;
		}
	}
	
	private void updateGoalSummary(GoalsSummary goalsSummary, Point currentPoint, Point lastPoint, Event event, Event lastEvent) {
		if (event.isGoal()) {
			if (currentPoint.isOurPoint(lastPoint)) {
				if (event.isOffense()) {
					goalsSummary.incrementOurOlineGoals();
				} else {
					goalsSummary.incrementOurDlineGoals();
				}
			} else {
				if (event.isOffense()) {
					goalsSummary.incrementTheirOlineGoals();
				} else {
					goalsSummary.incrementTheirDlineGoals();
				}
			}
		}
	}
	
	
	private void updateTrend(TrendPoint gameTrendPoint, Point currentPoint, Point lastPoint, Event event, Event lastEvent, int touches) {
		if (event.getAction().equals(DROP)) {
			gameTrendPoint.incrementDrops();
		} else if (event.getAction().equals(THROWAWAY)) {
			gameTrendPoint.incrementThroways();
		} 
		gameTrendPoint.incrementThroways();
	}
}
