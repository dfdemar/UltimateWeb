package com.summithill.ultimate.model.lightweights;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown=true)
public class Point {
	private List<Event> events;
	private List<String> line;
	private List<PlayerSubstitution> substitutions;
	private long startSeconds;
	private long endSeconds;
	private PointSummary summary;

	@JsonIgnore
	public boolean isOurPoint(Point lastPoint) {
		Score currentScore = this.getSummary().getScore();
		if (lastPoint == null) {
			return currentScore.getOurs() > currentScore.getTheirs();
		} else {
			return currentScore.getOurs() > lastPoint.getSummary().getScore()
					.getOurs();
		}
	}

	@JsonIgnore
	public boolean isOline() {
		return this.summary.isOline();
	}

	public List<Event> getEvents() {
		return events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

	public List<String> getLine() {
		return line;
	}

	public void setLine(List<String> line) {
		this.line = line;
	}

	public PointSummary getSummary() {
		return summary;
	}

	public void setSummary(PointSummary summary) {
		this.summary = summary;
	}

	public long getStartSeconds() {
		return startSeconds;
	}

	public void setStartSeconds(long startSeconds) {
		this.startSeconds = startSeconds;
	}

	public long getEndSeconds() {
		return endSeconds;
	}

	public void setEndSeconds(long endSeconds) {
		this.endSeconds = endSeconds;
	}

	public List<PlayerSubstitution> getSubstitutions() {
		return substitutions;
	}

	public void setSubstitutions(List<PlayerSubstitution> substitutions) {
		this.substitutions = substitutions;
	}

	// answer the players that played during the entire point (were not
	// subsitutited in or out)
	@JsonIgnore
	public Set<String> playersInEntirePoint() {
		HashSet<String> players = new HashSet<String>();
		players.addAll(getLine());
		if (substitutions != null && substitutions.size() > 0) {
			for (PlayerSubstitution sub : substitutions) {
				players.remove(sub.getFromPlayer());
				players.remove(sub.getToPlayer());
			}
		}
		return players;
	}

	// answer the players that were substituted in or out during the point
	@JsonIgnore
	public Set<String> playersInPartOfPoint() {
		HashSet<String> players = new HashSet<String>();
		if (substitutions != null && substitutions.size() > 0) {
			for (PlayerSubstitution sub : substitutions) {
				players.add(sub.getFromPlayer());
				players.add(sub.getToPlayer());
			}
		}
		return players;
	}

	// answer the players that played during any or all of the point
	@JsonIgnore
	public Set<String> playersInPoint() {
		HashSet<String> players = new HashSet<String>();
		players.addAll(getLine());
		if (substitutions != null && substitutions.size() > 0) {
			for (PlayerSubstitution sub : substitutions) {
				players.add(sub.getFromPlayer());
				players.add(sub.getToPlayer());
			}
		}
		return players;
	}

	// answer a description of all of the players (including substitutions) that
	// played in the point
	@JsonIgnore
	public String playersInPointDescription() {
		HashSet<String> allPlayerNames = new HashSet<String>();
		allPlayerNames.addAll(getLine());
		if (substitutions != null) {
			for (PlayerSubstitution sub : substitutions) {
				allPlayerNames.add(sub.getFromPlayer());
				allPlayerNames.add(sub.getToPlayer());
			}
			for (PlayerSubstitution sub : substitutions) {
				if (allPlayerNames.contains(sub.getFromPlayer())) {
					allPlayerNames.remove(sub.getFromPlayer());
					allPlayerNames.add(sub.getFromPlayer() + " (partial)");
				}
				if (allPlayerNames.contains(sub.getToPlayer())) {
					allPlayerNames.remove(sub.getToPlayer());
					allPlayerNames.add(sub.getToPlayer() + " (partial)");
				}
			}
		}
		List<String> names = new ArrayList<String>(allPlayerNames);
		Collections.sort(names);
		return StringUtils.join(names, ", ");
	}

	@JsonIgnore
	public void renamePlayer(String oldPlayerName, String newPlayerName) {
		if (getLine() != null) {
			boolean found = removePlayer(oldPlayerName);
			if (found) {
				getLine().add(newPlayerName);
			}
		}
		if (getEvents() != null) {
			for (Event event : getEvents()) {
				event.renamePlayer(oldPlayerName, newPlayerName);
			}
		}
		if (getSubstitutions() != null) {
			for (PlayerSubstitution substitution : getSubstitutions()) {
				substitution.renamePlayer(oldPlayerName, newPlayerName);
			}
		}
	}

	@JsonIgnore
	private boolean removePlayer(String playerName) {
		boolean found = false;
		List<String> newLine = new ArrayList<String>();
		for (String player : getLine()) {
			if (player.equalsIgnoreCase(playerName)) {
				found = true;
			} else {
				newLine.add(player);
			}
		}
		setLine(newLine);
		return found;
	}
}
