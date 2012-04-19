package com.summithill.ultimate.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

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
	protected Logger log = Logger.getLogger(MobileRestController.class.getName());
	
	public long saveTeam(String userIdentifier, Team team) {
		Entity entity = team.asEntity();
		this.addUserToEntity(entity, userIdentifier);
		Entity teamEntity = team.asEntity();
		getDatastore().put(team.asEntity());
		return teamEntity.getKey().getId();
	}

	public List<Team> getTeams(String userIdentifier) {
		Query query = new Query(Team.ENTITY_TYPE_NAME, null);
		addUserFilter(userIdentifier, query);
	    Iterable<Entity> teamEntities = getDatastore().prepare(query).asIterable();
	    List<Team> teamList = new ArrayList<Team>();
	    for (Entity teamEntity : teamEntities) {
			teamList.add(Team.fromEntity(teamEntity));
		}
	    return teamList;
	}
	
	public List<Player> getPlayers(Team team) {
		Query query = new Query(Player.ENTITY_TYPE_NAME, null).addSort("name", Query.SortDirection.ASCENDING);
		query.setAncestor(team.asEntity().getKey());
	    Iterable<Entity> playerEntities = getDatastore().prepare(query).asIterable();
	    List<Player> playerList = new ArrayList<Player>();
	    for (Entity playerEntity : playerEntities) {
	    	playerList.add(Player.fromEntity(playerEntity));
		}
	    return playerList;
	}
	
	public List<Game> getGames(Team team) {
		long beginTime = System.currentTimeMillis();
		Query query = new Query(Game.ENTITY_TYPE_NAME, null); //.addSort("timestamp", Query.SortDirection.DESCENDING);
		query.setAncestor(team.asEntity().getKey());
	    Iterable<Entity> gameEntities = getDatastore().prepare(query).asIterable();
	    List<Game> gameList = new ArrayList<Game>();
	    for (Entity gameEntity : gameEntities) {
	    	gameList.add(Game.fromEntity(gameEntity));
		}
	    log.info("GetGames took " + (System.currentTimeMillis() - beginTime) + "ms");
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
	
	public void savePlayers(String userIdentifier, Team team, List<Player> players) {
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
        query.addFilter(Game.GAME_ID_NAME_PROPERTY,
                Query.FilterOperator.EQUAL,
                gameId);
	    Iterator<Entity> gameEntities = getDatastore().prepare(query).asIterator();
	    return gameEntities.hasNext() ? Game.fromEntity(gameEntities.next()) : null;
	}
	
	public void saveGame(String userIdentifier, Game game) {
		Entity entity = game.asEntity();
		this.addUserToEntity(entity, userIdentifier);
		getDatastore().put(entity);

	}
	
	public void deleteGame(Game game) {
		getDatastore().delete(game.asEntity().getKey());
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
	}

	public Team getTeam(String userIdentifier, String teamName) {
        Query query = new Query(Team.ENTITY_TYPE_NAME);
        addUserFilter(userIdentifier, query);
        query.addFilter(Team.NAME_PROPERTY,
                    Query.FilterOperator.EQUAL,
                    teamName);
        List<Entity> teamEntities = getDatastore().prepare(query).asList(FetchOptions.Builder.withLimit(1));
        return teamEntities.size() == 1 ? Team.fromEntity(teamEntities.get(0)) : null;
	}
	
	public Team getTeam(String id) {
		if (id == null ) {
			return null;
		}
		try {
			return Team.fromEntity(getDatastore().get(KeyFactory.createKey(Team.ENTITY_TYPE_NAME, Long.parseLong(id))));
		} catch (EntityNotFoundException e1) {
			return null;
		}
   	}
	
	
	private DatastoreService getDatastore() {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		return datastore;
	}
	
	private void addUserFilter(String userIdentifier, Query query) {
		query.addFilter(USER_ID_PROPERTY, Query.FilterOperator.EQUAL, userIdentifier);
	}
	
	private void addUserToEntity(Entity entity, String userIdentifier) {
		entity.setProperty(USER_ID_PROPERTY, userIdentifier);
	}
	
}
