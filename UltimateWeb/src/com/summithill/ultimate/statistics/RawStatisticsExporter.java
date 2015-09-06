package com.summithill.ultimate.statistics;

import java.io.Writer;
import java.util.List;
import java.util.logging.Logger;

import com.summithill.ultimate.controller.MobileRestController;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.Team;
import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.Point;
import com.summithill.ultimate.service.TeamService;

public class RawStatisticsExporter extends AbstractStatisticsCalculator {
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
	private String teamId;  // optional...team ID will be first column of data if set
	private Anonymizer anonymizer;
		
	public RawStatisticsExporter(TeamService service) {
		this(service, null, null);
	}
	
	public RawStatisticsExporter(TeamService service, String teamId, Anonymizer anonymizer) {
		super(service);
		this.teamId = teamId;
		this.anonymizer = anonymizer;
	}
	
	public void writeStats(Writer writer, Team team, List<String> gameIds) {
		EventWriter eventWriter = new EventWriter(writer, anonymizer, teamId);
		for (String gameId : gameIds) {
			Game game = getGame(team, gameId);
			this.writeStatsForGame(eventWriter, game);
		}
	}
	
	private void writeStatsForGame(EventWriter eventWriter, Game game) {
		Event firstEvent = game.getFirstEvent();
		for (Point point : game.getPoints()) {
			for (Event event : point.getEvents()) {
				eventWriter.writeEvent(event, game, point, firstEvent);
			}
		}
	}
	

}
