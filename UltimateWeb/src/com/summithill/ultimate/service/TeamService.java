package com.summithill.ultimate.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.lang.time.DateUtils;
import org.springframework.stereotype.Component;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.summithill.ultimate.controller.MobileRestController;
import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.ModelObject;
import com.summithill.ultimate.model.Player;
import com.summithill.ultimate.model.Team;

@Component
public class TeamService {
	private static final String USER_ID_PROPERTY = ModelObject.USER_ID_PROPERTY;
	protected Logger log = Logger.getLogger(MobileRestController.class
			.getName());

	public long saveTeam(String userIdentifier, Team team) {
		try {
			updateTeamSummaryData(team);
		} catch (Exception e) {
			log.log(Level.SEVERE, "unable to update team summary data for team " + team.getName());
			// don't prevent team save if the summary upate fails
		}
		Entity entity = team.asEntity();
		this.addUserToEntity(entity, userIdentifier);
		Entity teamEntity = team.asEntity();
		getDatastore().put(team.asEntity());
		return teamEntity.getKey().getId();
	}

	public List<Team> getTeams(String userIdentifier) {
		Query query = new Query(Team.ENTITY_TYPE_NAME, null);
		addUserFilter(userIdentifier, query);
		Iterable<Entity> teamEntities = getDatastore().prepare(query)
				.asIterable();
		List<Team> teamList = new ArrayList<Team>();
		for (Entity teamEntity : teamEntities) {
			teamList.add(Team.fromEntity(teamEntity));
		}
		return teamList;
	}

	public List<Team> getAllTeams() {
		Query query = new Query(Team.ENTITY_TYPE_NAME, null);
		Iterable<Entity> teamEntities = getDatastore().prepare(query)
				.asIterable();
		List<Team> teamList = new ArrayList<Team>();
		for (Entity teamEntity : teamEntities) {
			teamList.add(Team.fromEntity(teamEntity));
		}
		return teamList;
	}

	public List<Player> getPlayers(Team team) {
		Query query = new Query(Player.ENTITY_TYPE_NAME, null).addSort("name",
				Query.SortDirection.ASCENDING);
		query.setAncestor(team.asEntity().getKey());
		Iterable<Entity> playerEntities = getDatastore().prepare(query)
				.asIterable();
		List<Player> playerList = new ArrayList<Player>();
		for (Entity playerEntity : playerEntities) {
			playerList.add(Player.fromEntity(playerEntity));
		}
		Collections.sort(playerList);
		return playerList;
	}

	public boolean deletePlayer(Team team, String playerName) {
		List<Player> playerList = getPlayers(team);
		for (Player player : playerList) {
			if (player.getName().equals(playerName)) {
				getDatastore().delete(player.asEntity().getKey());
				return true;
			}
		}
		return false;
	}

	public List<Game> getGames(Team team) {
		Query query = new Query(Game.ENTITY_TYPE_NAME, null); // .addSort("timestamp",
																// Query.SortDirection.DESCENDING);
		query.setAncestor(team.asEntity().getKey());
		Iterable<Entity> gameEntities = getDatastore().prepare(query)
				.asIterable();
		List<Game> gameList = new ArrayList<Game>();
		for (Entity gameEntity : gameEntities) {
			gameList.add(Game.fromEntity(gameEntity));
		}
		return gameList;
	}

	public List<Game> getGamesSince(int days) {
		Date firstDate = DateUtils.addDays(new Date(), -1 * days);
		DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String firstDateString = formatter.format(firstDate);
		Query query = new Query(Game.ENTITY_TYPE_NAME, null);
		query.addFilter(Game.TIMESTAMP_PROPERTY, Query.FilterOperator.GREATER_THAN,
				firstDateString);
		Iterable<Entity> gameEntities = getDatastore().prepare(query)
				.asIterable();
		
		List<Game> gameList = new ArrayList<Game>();
		Date tomorrow = DateUtils.addDays(new Date(), 1);
		String tommorrowDateString = formatter.format(tomorrow);
		for (Entity gameEntity : gameEntities) {
			Game game = Game.fromEntity(gameEntity);
			if (game.getTimestamp().compareTo(tommorrowDateString) < 0) {  // drop future dates
				gameList.add(game);
			}
		}
		return gameList;
	}

	public List<String> getGameIDs(Team team) {
		List<String> idList = new ArrayList<String>();
		List<Game> games = this.getGames(team);
		for (Game game : games) {
			idList.add(game.getGameId());
		}
		return idList;
	}

	private void deleteAllPlayers(String userIdentifier, Team team) {
		List<Player> players = getPlayers(team);
		List<Key> playerKeys = new ArrayList<Key>();
		for (Player player : players) {
			playerKeys.add(player.asEntity().getKey());
		}
		getDatastore().delete(playerKeys);
	}

	public void savePlayers(String userIdentifier, Team team,
			List<Player> players) {
		this.deleteAllPlayers(userIdentifier, team);
		for (Player player : players) {
			Entity entity = player.asEntity();
			this.addUserToEntity(entity, userIdentifier);
			getDatastore().put(entity);
		}
	}

	public Game getGame(Team team, String gameId) {
		Query query = new Query(Game.ENTITY_TYPE_NAME, null);
		query.setAncestor(team.asEntity().getKey());
		query.addFilter(Game.GAME_ID_NAME_PROPERTY, Query.FilterOperator.EQUAL,
				gameId);
		Iterator<Entity> gameEntities = getDatastore().prepare(query)
				.asIterator();
		return gameEntities.hasNext() ? Game.fromEntity(gameEntities.next())
				: null;
	}

	public void saveGame(String userIdentifier, Game game) {
		updateLastUpdatedTimestamp(game);
		Entity entity = game.asEntity();
		this.addUserToEntity(entity, userIdentifier);
		getDatastore().put(entity);
		// update team (will recalulate first/last game, etc.)
		Team team = getTeam(game.getParentPersistenceId());
		saveTeam(userIdentifier, team);  

	}

	public void deleteGame(String userIdentifier, Game game) {
		Team team = getTeam(game.getParentPersistenceId());
		getDatastore().delete(game.asEntity().getKey());
		saveTeam(userIdentifier, team);  
	}

	public void deleteTeam(Team team) {
		getDatastore().delete(team.asEntity().getKey());
	}

	public void deleteAllGames(String userIdentifier, Team team) {
		List<Game> games = getGames(team);
		List<Key> gameKeys = new ArrayList<Key>();
		for (Game game : games) {
			gameKeys.add(game.asEntity().getKey());
		}
		getDatastore().delete(gameKeys);
		saveTeam(userIdentifier, team);  
	}

	public Team getTeam(String userIdentifier, String teamName) {
		Query query = new Query(Team.ENTITY_TYPE_NAME);
		addUserFilter(userIdentifier, query);
		query.addFilter(Team.NAME_PROPERTY, Query.FilterOperator.EQUAL,
				teamName);
		List<Entity> teamEntities = getDatastore().prepare(query).asList(
				FetchOptions.Builder.withLimit(1));
		return teamEntities.size() == 1 ? Team.fromEntity(teamEntities.get(0))
				: null;
	}

	public Team getTeam(String id) {
		if (id == null) {
			return null;
		}
		try {
			return Team.fromEntity(getDatastore().get(
					KeyFactory.createKey(Team.ENTITY_TYPE_NAME,
							Long.parseLong(id))));
		} catch (EntityNotFoundException e1) {
			return null;
		}
	}

	public long copyTeam(String userIdentifier, String id) {
		// copy team
		Team team = getTeam(id);
		Team teamCopy = team.clone(userIdentifier);
		teamCopy.setName(team.getName() + " COPY");
		long newTeamId = saveTeam(userIdentifier, teamCopy);

		// copy players
		List<Player> players = getPlayers(team);
		List<Player> copiedPlayers = getPlayers(team);
		for (Player player : players) {
			Player playerCopy = player.clone(userIdentifier, teamCopy);
			copiedPlayers.add(playerCopy);
		}
		savePlayers(userIdentifier, teamCopy, copiedPlayers);

		// copy games
		List<String> gameIds = getGameIDs(team);
		for (String gameId : gameIds) {
			Game game = getGame(team, gameId);
			Game gameCopy = game.clone(userIdentifier, teamCopy);
			saveGame(userIdentifier, gameCopy);
		}

		return newTeamId;
	}
	
	public void forceUpdateAllTeamsSummaryData(boolean recalculate)  {
		List<Team> teams = getAllTeams();
		int count = 0;
		for (Team team : teams) {
			boolean shouldUpdate = recalculate || team.getFirstGameDate() == null;
			if (shouldUpdate) {
				try {
					updateTeamSummaryData(team);
					getDatastore().put(team.asEntity());
					count++;
				} catch (Exception e) {
					log.log(Level.SEVERE, "unable to update team summary data for team " + team.getName());
				}
			}
			log.log(Level.INFO, "teams updated count = " + count);
		}
	}

	private DatastoreService getDatastore() {
		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();
		return datastore;
	}

	private void addUserFilter(String userIdentifier, Query query) {
		query.addFilter(USER_ID_PROPERTY, Query.FilterOperator.EQUAL,
				userIdentifier);
	}

	private void addUserToEntity(Entity entity, String userIdentifier) {
		entity.setProperty(USER_ID_PROPERTY, userIdentifier);
	}
	
    private void updateTeamSummaryData(Team team) {
        List<Game> games = getGames(team);
        team.setNumberOfGames(games.size());
    	String firstGame = null;
    	String lastGame = null;
        for (Game game : games) {
			firstGame = minDate(firstGame, game.getTimestamp());
			lastGame = maxDate(lastGame, game.getTimestamp());
		}
        team.setFirstGameDate(firstGame);
        team.setLastGameDate(lastGame);
    }
    
    private String minDate(String s1, String s2) {
    	if (s1 == null) {
    		return s2;
    	} else if (s2 == null) {
    		return s1;
    	} else {
    		return s1.compareTo(s2) < 0 ? s1 : s2;
    	}
    }
    
    private String maxDate(String s1, String s2) {
    	if (s1 == null) {
    		return s2;
    	} else if (s2 == null) {
    		return s1;
    	} else {
    		return s1.compareTo(s2) < 0 ? s2 : s1;
    	}
    }
    
    private void updateLastUpdatedTimestamp(Game game) {
		TimeZone utc = TimeZone.getTimeZone("UTC");
		DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		formatter.setTimeZone(utc);
		String nowAsUtcFormattedString = formatter.format(new Date());
		game.setLastUpdateUtc(nowAsUtcFormattedString);;
    }

}
