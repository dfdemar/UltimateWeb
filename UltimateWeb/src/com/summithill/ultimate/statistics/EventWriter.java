package com.summithill.ultimate.statistics;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.lang.StringUtils;

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
			writer.write(game.getTimestamp());
			writer.write(DELIMITER);
			writer.write(this.replaceDelims(game.getTournamentName()));
			writer.write(DELIMITER);			
			writer.write(this.replaceDelims(game.getOpponentName()));
			writer.write(DELIMITER);
			writer.write(asString(pointSummary.getElapsedTime()));
			writer.write(DELIMITER);
			writer.write(pointSummary.getLineType());
			writer.write(DELIMITER);
			writer.write(asString(pointSummary.getScore().getOurs()));		
			writer.write(DELIMITER);
			writer.write(asString(pointSummary.getScore().getTheirs()));			
			writer.write(DELIMITER);
			writer.write(event.getType());		
			writer.write(DELIMITER);
			writer.write(event.getAction());
			writer.write(DELIMITER);
			writer.write(replaceDelims(event.getPasser()));			
			writer.write(DELIMITER);
			writer.write(replaceDelims(event.getReceiver()));			
			writer.write(DELIMITER);
			writer.write(replaceDelims(event.getDefender()));
			if (point.getLine() != null) {
				for (String playerName : point.getLine()) {
					writer.write(DELIMITER);
					writer.write(replaceDelims(playerName));
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