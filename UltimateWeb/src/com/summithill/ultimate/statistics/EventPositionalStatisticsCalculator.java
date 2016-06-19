package com.summithill.ultimate.statistics;

import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.EventPosition;
import com.summithill.ultimate.model.lightweights.FieldDimensions;

public class EventPositionalStatisticsCalculator {
	
    private static final EventPositionalStatisticsCalculator instance = new EventPositionalStatisticsCalculator();
    
    private EventPositionalStatisticsCalculator(){}

    public static EventPositionalStatisticsCalculator getInstance(){
        return instance;
    }
    
	public EventPositionalStatistics calculatePositionalStats(FieldDimensions dimensions, Event event, Event previousEvent) {
		
		EventPositionalStatistics stats = new EventPositionalStatistics();
		EventPosition position = event.getNormalizedPosition();
		EventPosition previousPosition = event.getPosBegin() == null ? previousEvent.getNormalizedPosition() : event.getNormalizedPositionBegin();
		stats.setBeginPosition(previousPosition);
		stats.setEndPosition(position);
		
		return stats;
		
	}
}
