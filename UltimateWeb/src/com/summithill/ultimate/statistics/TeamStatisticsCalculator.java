package com.summithill.ultimate.statistics;

import static com.summithill.ultimate.model.lightweights.Event.DROP;
import static com.summithill.ultimate.model.lightweights.Event.THROWAWAY;

import java.util.List;
import java.util.logging.Logger;

import com.summithill.ultimate.controller.MobileRestController;
import com.summithill.ultimate.controller.Wind;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.Point;
import com.summithill.ultimate.model.lightweights.PointSummary;
import com.summithill.ultimate.model.lightweights.Score;
import com.summithill.ultimate.service.TeamService;

public class TeamStatisticsCalculator extends AbstractStatisticsCalculator {
	private static final int CROSSWIND_DEGREES_OFF = 30; // how many degrees off due North/South is considered cross wind?
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
	private TeamStats teamStats = new TeamStats();
	
	public TeamStatisticsCalculator(TeamService service) {
		super(service);
	}
	
	public TeamStats calculateStats(Team team, List<String> gameIds) {
		
		for (String gameId : gameIds) {
			Game game = getGame(team, gameId);
			updateStatsForGame(game);
		}
		
		return getStats();
	}
	
	public TeamStats getStats() {
		return teamStats;
	}
	
	public void updateStatsForGame(Game game) {
		Score halfTimeScore = null;
		WindDirection ourTeamFirstPointWindDirection = ourTeamFirstPointWindDirection(game.getWind(), game.isFirstPointOline());
		TrendPoint gameTrendPoint = teamStats.addNewTrendPoint();
		List<Point> points = game.getPoints();
		Point lastPoint = null;
		for (Point point : points) {
			WindDirection ourTeamWindDirectionForPoint = 
					ourTeamWindDirectionForPoint(ourTeamFirstPointWindDirection, halfTimeScore != null, point.getSummary().getScore(), halfTimeScore);
			if (point.getSummary().getScore().highestScore() == game.halftimeHighestScore()) {
				halfTimeScore = point.getSummary().getScore();
			}
			List<Event> events = point.getEvents();
			Event lastEvent = null;
			for (Event event : events) {
				int touches = calculateTouches(event, lastEvent);
				updateGoalSummary(teamStats.getGoalSummary(), point, lastPoint, event, lastEvent);
				updateTrend(gameTrendPoint, point, lastPoint, event, lastEvent, touches);
				updateWindSummary(point.getSummary(), event, lastEvent, game.getWind(), teamStats.getWindSummary(),ourTeamWindDirectionForPoint);
				lastEvent = event;
			}
			lastPoint = point;
		}
		summarizeGame(gameTrendPoint);
	}
	
	
	private void updateWindSummary(PointSummary pointSummary, Event event, Event lastEvent, Wind wind, WindSummary windSummary, WindDirection ourTeamWindDirectionForPoint) {
		WindEffect windEffect = windSummary.findWindEffectBucket(wind);
		
		// OPPORTUNTIES
		// first point on offense
		if (lastEvent == null && pointSummary.isOline()) {
			windEffect.getOurStats().incrementGoalOpportunties();
		// first point on offense
		} else if (event.isPull()) {
			windEffect.getTheirStats().incrementGoalOpportunties();
		// turnover	
		} else if (event.isTurnover()) {
			if (event.isOffense()) {
				windEffect.getTheirStats().incrementGoalOpportunties();
			} else {
				windEffect.getOurStats().incrementGoalOpportunties();
			}
			
		// GOALS	
		} else if (event.isGoal()) {
			WindStats windStats = event.isOffense() ? windEffect.getOurStats() : windEffect.getTheirStats();
			if (wind == null || wind.getMph() <= 0) {
				windStats.incrementGoalsWindUnknown();
			} else {
				if (ourTeamWindDirectionForPoint == WindDirection.CROSSWIND) {
					windStats.incrementGoalsAcrossWind();
				} else {
					WindDirection windDirection = event.isOffense() ? ourTeamWindDirectionForPoint : reverseWindDirection(ourTeamWindDirectionForPoint);
					if (windDirection == WindDirection.DOWNWIND) {
						windStats.incrementGoalsWithWind();
					} else {
						windStats.incrementGoalsAgainstWind();
					}
				}
			}
		}
	}
	
	private void updateGoalSummary(GoalsSummary goalsSummary, Point currentPoint, Point lastPoint, Event event, Event lastEvent) {
		if (event.isGoal()) {
			if (currentPoint.isOurPoint(lastPoint)) {
				if (currentPoint.isOline()) {
					goalsSummary.incrementOurOlineGoals();
				} else {
					goalsSummary.incrementOurDlineGoals();
				}
			} else {
				if (currentPoint.isOline()) {
					goalsSummary.incrementTheirDlineGoals();
				} else {
					goalsSummary.incrementTheirOlineGoals();
				}
			}
		}
	}
	
	
	private void updateTrend(TrendPoint gameTrendPoint, Point currentPoint, Point lastPoint, Event event, Event lastEvent, int touches) {
		if (event.getAction().equals(DROP)) {
			gameTrendPoint.incrementDrops();
		} else if (event.isOffense() && event.getAction().equals(THROWAWAY)) {
			gameTrendPoint.incrementThrowaways();
		} 
		
		gameTrendPoint.setTouches(gameTrendPoint.getTouches() + touches);
	}
	
	private void summarizeGame(TrendPoint gameTrendPoint) {
		gameTrendPoint.calculateTurnoversPerTouch();
	}
	
	private WindDirection ourTeamWindDirectionForPoint(WindDirection ourDirectionFirstPoint, boolean isAfterHalftime, Score score, Score scoreAtHalftime) {
		if (ourDirectionFirstPoint == null) {
			return null;
		}
		if (ourDirectionFirstPoint == WindDirection.CROSSWIND) {
			return WindDirection.CROSSWIND;
		}
		return areTeamsFacingSameWindDirectionAsFirstPoint(isAfterHalftime, score, scoreAtHalftime) ? ourDirectionFirstPoint : reverseWindDirection(ourDirectionFirstPoint);
	}
	
	private boolean areTeamsFacingSameWindDirectionAsFirstPoint(boolean isAfterHalftime, Score score, Score scoreAtHalftime) {
		if (score.combinedScore() == 0 ) {
			return true;
		} else if (!isAfterHalftime) {
			return (score.combinedScore() % 2) == 0;
		} else {
			int pointsSinceHalf = score.combinedScore() - scoreAtHalftime.combinedScore();
			return (pointsSinceHalf % 2) == 1;
		}
	}
	
	private WindDirection ourTeamFirstPointWindDirection(Wind wind, boolean isOurTeamStartingOnOffense) {
		if (wind == null) {
			return null;
		}
		if (
				wind.getDegrees() <= CROSSWIND_DEGREES_OFF || 
				wind.getDegrees() >= (360 - CROSSWIND_DEGREES_OFF) ||
				(wind.getDegrees() >= (180 - CROSSWIND_DEGREES_OFF) && wind.getDegrees() <= (180 + CROSSWIND_DEGREES_OFF))) {
			return WindDirection.CROSSWIND;
		}
		boolean isDownwind = wind.getDegrees() < 180;
		isDownwind = wind.isLeftToRight() ? isDownwind : !isDownwind;
		isDownwind = isOurTeamStartingOnOffense ? isDownwind : !isDownwind;
		return isDownwind ? WindDirection.DOWNWIND : WindDirection.UPWIND;	
	}
	
	private WindDirection reverseWindDirection(WindDirection direction) {
		if (direction == WindDirection.CROSSWIND) {
			return direction;
		}
		return direction == WindDirection.DOWNWIND ? WindDirection.UPWIND : WindDirection.DOWNWIND;
	}
}
