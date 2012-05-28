package com.summithill.ultimate.statistics;

import java.util.List;
import java.util.logging.Logger;

import com.summithill.ultimate.controller.MobileRestController;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.service.TeamService;

public class AllStatisticsCalculator extends AbstractStatisticsCalculator {
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
	private PlayerStatisticsCalculator playerCalculator;
	private TeamStatisticsCalculator teamCalculator;
	
	public AllStatisticsCalculator(TeamService service) {
		super(service);
	}
	
	public AllStats calculateStats(Team team, List<String> gameIds) {
		playerCalculator = new PlayerStatisticsCalculator(getService());
		teamCalculator = new TeamStatisticsCalculator(getService());
		
		for (String gameId : gameIds) {
			Game game = getGame(team, gameId);
			playerCalculator.updateStatsForGame(game);
			teamCalculator.updateStatsForGame(game);
		}
		
		AllStats allStats = new AllStats();
		allStats.setPlayerStats(playerCalculator.getStats());
		allStats.setTeamStats(teamCalculator.getStats());
		return allStats;
	}
	

}
