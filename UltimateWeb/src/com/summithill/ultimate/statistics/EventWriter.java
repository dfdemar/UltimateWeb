package com.summithill.ultimate.statistics;

import java.io.IOException;
import java.io.Writer;

import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.FieldDimensions;
import com.summithill.ultimate.model.lightweights.Point;
import com.summithill.ultimate.model.lightweights.PointSummary;

public class EventWriter {
	private static String DELIMITER = ",";
	private static String DELIMITER_REPLACEMENT = "-";
	private int MAX_PLAYERS_IN_POINT = 28;
	private Writer writer;
	private Anonymizer anonymizer;
	private String teamId;
	
	public EventWriter(Writer writer) {
		this(writer, null, null);
	}
	
	public EventWriter(Writer writer, Anonymizer anonymizer, String teamId) {
		super();
		this.writer = writer;
		this.anonymizer = anonymizer;
		this.teamId = teamId;
		this.writeHeader();
	}

	public void writeEvent(Event event, Game game, Point point, Event firstEventOfGame, Event previousEvent) {
		FieldDimensions fieldDimensions = game.getFieldDimensions();
		PointSummary pointSummary = point.getSummary();
		try {
			if (this.teamId != null) {
				this.writeWithDelimiterAfter(teamDisplayName(this.teamId));
			}
			this.writeWithDelimiterAfter(displayableTimestamp(game.getTimestamp()));
			this.writeWithDelimiterAfter(this.replaceDelims(tournamentDisplayName(game.getTournamentName())));
			this.writeWithDelimiterAfter(this.replaceDelims(opponentDisplayName(game.getOpponentName())));
			this.writeWithDelimiterAfter(asString(pointSummary.getElapsedTime()));
			this.writeWithDelimiterAfter(pointSummary.getLineType());
			this.writeWithDelimiterAfter(asString(pointSummary.getScore().getOurs()));
			this.writeWithDelimiterAfter(asString(pointSummary.getScore().getTheirs()));
			this.writeWithDelimiterAfter(event.getType());
			this.writeWithDelimiterAfter(event.getAction());
			this.writeWithDelimiterAfter(replaceDelims(playerDisplayName(event.getPasser())));
			this.writeWithDelimiterAfter(replaceDelims(playerDisplayName(event.getReceiver())));
			this.writeWithoutDelimiter(replaceDelims(playerDisplayName(event.getDefender())));
			String hangTime = "";
			if (event.getDetails() != null && event.getDetails().getHangtime() > 0) {
				float hangTimeSeconds = (float)event.getDetails().getHangtime()  / 1000f;
				hangTime = this.asString(hangTimeSeconds);
			} 
			this.writeWithDelimiterBefore(hangTime);
			if (point.getLine() != null) {
				int i = 0;
				for (String playerName : point.playersInPoint()) {
					i++;
					if (i < MAX_PLAYERS_IN_POINT) {
						this.writeWithDelimiterBefore(replaceDelims(playerDisplayName(playerName)));
					}
				}
				while (i < MAX_PLAYERS_IN_POINT) {
					this.writeWithDelimiterBefore("");
					i++;
				}
			}
			if (firstEventOfGame != null && firstEventOfGame.getTimestamp() != 0 && event.getTimestamp() >= firstEventOfGame.getTimestamp()) {
				int elapsedTime = (int) (event.getTimestamp() - firstEventOfGame.getTimestamp());
				this.writeWithDelimiterBefore(this.asString(elapsedTime));
			} else {
				this.writeWithDelimiterBefore("");
			}
			if (game.isPositional() && fieldDimensions != null) {
				writeDelimiter();
				EventPositionalStatistics positionalStats = EventPositionalStatisticsCalculator.getInstance().calculatePositionalStats(point, fieldDimensions, event, previousEvent);
				if (positionalStats.getBeginPosition() != null) {
					writeWithDelimiterAfter(positionalStats.getBeginPosition().getAreaDescription());
					writeWithDelimiterAfter(asString(positionalStats.getBeginPosition().getX(),3));
					writeWithDelimiterAfter(asString(positionalStats.getBeginPosition().getY(),3));
				} else {
					writeDelimiters(3);
				}
				if (positionalStats.getEndPosition() != null) {
					writeWithDelimiterAfter(positionalStats.getEndPosition().getAreaDescription());
					writeWithDelimiterAfter(asString(positionalStats.getEndPosition().getX(),3));
					writeWithDelimiterAfter(asString(positionalStats.getEndPosition().getY(),3));
				} else {
					writeDelimiters(3);
				}
				writeWithDelimiterAfter(fieldDimensions.unitOfMeasureDescription());
				writeWithDelimiterAfter(asString(positionalStats.getDistance(),1));
				writeWithDelimiterAfter(asString(positionalStats.getDistanceLateral(),1));
				writeWithDelimiterAfter(asString(positionalStats.getDistanceTowardGoal(),1));
			}
			writer.write("\n");
		} catch (IOException e) {
			throw new RuntimeException("Error writing export", e);
		}
	}

	private void writeHeader() {
		try {
			if (teamId != null) {
				writer.write("Team");
				writer.write(DELIMITER);
			}
			writer.write("Date/Time");
			writer.write(DELIMITER);
			writer.write("Tournamemnt");
			writer.write(DELIMITER);			
			writer.write("Opponent");
			writer.write(DELIMITER);
			writer.write("Point Elapsed Seconds");
			writer.write(DELIMITER);
			writer.write("Line");		
			writer.write(DELIMITER);
			writer.write("Our Score - End of Point");	
			writer.write(DELIMITER);
			writer.write("Their Score - End of Point");
			writer.write(DELIMITER);
			writer.write("Event Type");
			writer.write(DELIMITER);
			writer.write("Action");
			writer.write(DELIMITER);
			writer.write("Passer");
			writer.write(DELIMITER);
			writer.write("Receiver");
			writer.write(DELIMITER);
			writer.write("Defender");
			writer.write(DELIMITER);
			writer.write("Hang Time (secs)");
			for (int i = 0; i < MAX_PLAYERS_IN_POINT; i++) {
				writer.write(DELIMITER);
				writer.write("Player " + Integer.toString(i));	
			}
			writer.write(DELIMITER);
			writer.write("Elapsed Time (secs)");
			writer.write(DELIMITER);
			writer.write("Begin Area");			
			writer.write(DELIMITER);
			writer.write("Begin X");
			writer.write(DELIMITER);
			writer.write("Begin Y");
			writer.write(DELIMITER);
			writer.write("End Area");			
			writer.write(DELIMITER);
			writer.write("End X");
			writer.write(DELIMITER);
			writer.write("End Y");
			writer.write(DELIMITER);
			writer.write("Distance Unit of Measure");	
			writer.write(DELIMITER);
			writer.write("Absolute Distance");				
			writer.write(DELIMITER);
			writer.write("Lateral Distance");		
			writer.write(DELIMITER);
			writer.write("Toward Our Goal Distance");				
			writer.write("\n");
		} catch (IOException e) {
			throw new RuntimeException("Error writing export", e);
		}
	}
	
	private void writeDelimiter() throws IOException {
		writer.write(DELIMITER);
	}
	
	private void writeDelimiters(int count) throws IOException {
		for (int i = 0; i < count; i++) {
			writeDelimiter();
		}
	}
	
	private void writeWithDelimiterBefore(String field) throws IOException {
		writer.write(DELIMITER);
		writer.write(field == null ? "" : field); 
	}
	
	private void writeWithDelimiterAfter(String field) throws IOException {
		writer.write(field == null ? "" : field); 
		writer.write(DELIMITER);
	}
	
	private void writeWithoutDelimiter(String field) throws IOException {
		writer.write(field == null ? "" : field); 
	}
	
	private String replaceDelims(String s) {
		if (s == null) {
			return "";
		}
		return s.replace(DELIMITER, DELIMITER_REPLACEMENT);
	}
	
	private String asString(long i) {
		return Long.toString(i);
	}
	
	private String asString(float f) {
		return Float.toString(f);
	}
	
	private String asString(float f, int decimalPositions) {
		return String.format("%." + decimalPositions + "f", f);
	}
	
	private String teamDisplayName(String teamId) {
		return anonymizer == null ? teamId : anonymizer.anonymizeTeamName(teamId);
	}
	
	private String playerDisplayName(String nickname) {
		return anonymizer == null ? nickname : anonymizer.anonymizeNickname(nickname);
	}
	
	private String opponentDisplayName(String opponentName) {
		return anonymizer == null ? opponentName : anonymizer.anonymizeOpponentName(opponentName);
	}
	
	private String tournamentDisplayName(String tournamentName) {
		return anonymizer == null ? tournamentName : anonymizer.anonymizeTournamentName(teamId, tournamentName);
	}
	
	private String displayableTimestamp(String timestamp) {
		return anonymizer == null ? timestamp : anonymizer.anonymizeTimestamp(timestamp);
	}

}