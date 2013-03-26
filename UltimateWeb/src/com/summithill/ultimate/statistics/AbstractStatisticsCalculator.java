package com.summithill.ultimate.statistics;

import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.service.TeamService;

public abstract class AbstractStatisticsCalculator {
	private TeamService service;
		
	public AbstractStatisticsCalculator(TeamService service) {
		super();
		this.service = service;
	}
	
	protected TeamService getService() {
		return service;
	}
	
	protected int calculateTouches(Event event, Event lastEvent) {
		if (event.isCatch() || (event.isGoal() && event.isOffense())) {
			// add a touch if we just picked up the disc for this event
			return  lastEvent == null || (lastEvent.isD()) ? 2 : 1;
		} else if (event.isCallahan()) {
			return 1;
		}
		return 0;
	}

	protected Game getGame(Team team, String gameId) {
		return service.getGame(team, gameId);
	}
}
