package com.summithill.ultimate.statistics;

import java.io.IOException;
import java.io.Writer;

import com.summithill.ultimate.model.Game;
import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.Point;
import com.summithill.ultimate.model.lightweights.PointSummary;

public class EventWriter {
	private static String DELIMITER = ",";
	private static String DELIMITER_REPLACEMENT = "-";
	private Writer writer;
	
	public EventWriter(Writer writer) {
		super();
		this.writer = writer;
		this.writeHeader();
	}

	public void writeEvent(Event event, Game game, Point point) {
		PointSummary pointSummary = point.getSummary();
		try {
			this.writeWithDelimiterAfter(game.getTimestamp());
			this.writeWithDelimiterAfter(this.replaceDelims(game.getTournamentName()));
			this.writeWithDelimiterAfter(this.replaceDelims(game.getOpponentName()));
			this.writeWithDelimiterAfter(asString(pointSummary.getElapsedTime()));
			this.writeWithDelimiterAfter(pointSummary.getLineType());
			this.writeWithDelimiterAfter(asString(pointSummary.getScore().getOurs()));
			this.writeWithDelimiterAfter(asString(pointSummary.getScore().getTheirs()));
			this.writeWithDelimiterAfter(event.getType());
			this.writeWithDelimiterAfter(event.getAction());
			this.writeWithDelimiterAfter(replaceDelims(event.getPasser()));
			this.writeWithDelimiterAfter(replaceDelims(event.getReceiver()));
			this.writeWithoutDelimiter(replaceDelims(event.getDefender()));
			if (point.getLine() != null) {
				for (String playerName : point.playersInPoint()) {
					this.writeWithDelimiterBefore(replaceDelims(playerName));
				}
			}
			writer.write("\n");
		} catch (IOException e) {
			throw new RuntimeException("Error writing export", e);
		}
	}

	private void writeHeader() {
		try {
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
			for (int i = 0; i < 12; i++) {
				writer.write(DELIMITER);
				writer.write("Player " + Integer.toString(i));	
			}
			
			writer.write("\n");
		} catch (IOException e) {
			throw new RuntimeException("Error writing export", e);
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

}