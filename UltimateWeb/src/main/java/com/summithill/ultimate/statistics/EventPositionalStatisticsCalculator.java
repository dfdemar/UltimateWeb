	package com.summithill.ultimate.statistics;

import com.summithill.ultimate.model.lightweights.Event;
import com.summithill.ultimate.model.lightweights.EventPosition;
import com.summithill.ultimate.model.lightweights.FieldDimensions;
import com.summithill.ultimate.model.lightweights.Point;

public class EventPositionalStatisticsCalculator {
	
    private static final EventPositionalStatisticsCalculator instance = new EventPositionalStatisticsCalculator();
    
    private EventPositionalStatisticsCalculator(){}

    public static EventPositionalStatisticsCalculator getInstance(){
        return instance;
    }
    
	public EventPositionalStatistics calculatePositionalStats(Point point, FieldDimensions fieldDimensions, Event event, Event previousEvent) {
		EventPositionalStatistics stats = new EventPositionalStatistics();
		EventPosition position = event.getNormalizedPosition();
		EventPosition previousPosition = event.getNormalizedPositionBegin();
		if (previousPosition == null) {
			previousPosition = previousEvent == null ? null : previousEvent.getNormalizedPosition();
		}
		stats.setBeginPosition(previousPosition);
		stats.setEndPosition(position);

		if (previousPosition != null) {
			stats.setDistance(calculateAbsoluteDistance(fieldDimensions, stats, position, previousPosition));
			stats.setDistanceLateral(calculateLateralDistance(fieldDimensions, stats, position, previousPosition));
			stats.setDistanceTowardGoal(calculateDistanceTowardGoal(event, point, fieldDimensions, stats, position, previousPosition));
		}
		
		return stats;
		
	}

	private float calculateAbsoluteDistance(FieldDimensions fieldDimensions, EventPositionalStatistics stats, EventPosition position, EventPosition previousPosition) {
		float y1 = previousPosition.getY() * fieldDimensions.getWidth();
		float y2 = position.getY() * fieldDimensions.getWidth();
		float x1 = xInTotalFieldAndEndzonesLength(fieldDimensions, previousPosition);
		float x2 = xInTotalFieldAndEndzonesLength(fieldDimensions, position);
		return (float) Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}
	
	private float calculateLateralDistance(FieldDimensions fieldDimensions, EventPositionalStatistics stats, EventPosition position, EventPosition previousPosition) {
		float y1 = previousPosition.getY() * fieldDimensions.getWidth();
		float y2 = position.getY() * fieldDimensions.getWidth();
		return (float) Math.abs(y2 - y1);
	}
	
	private float calculateDistanceTowardGoal(Event event, Point point, FieldDimensions fieldDimensions, EventPositionalStatistics stats, EventPosition position, EventPosition previousPosition) {
		float x1 = xInTotalFieldAndEndzonesLength(fieldDimensions, previousPosition);
		float x2 = xInTotalFieldAndEndzonesLength(fieldDimensions, position);
		float distance = x2 - x1;
		Event pullEvent = point.initialEvent();
		if (pullEvent != null && pullEvent.getPosBegin() != null) {
			if (pullEvent.getPosBegin().normalized().isCloserTo0Endzone()) { 
				distance = distance * -1;
			}
			if (point.isDline()) {
				distance = distance * -1;
			}
		}
		return distance;
	}

	private float xInTotalFieldAndEndzonesLength(FieldDimensions fieldDimensions, EventPosition position) {
		// compute first in the postion's area
		float x = position.getX() * (position.isEndZone() ? fieldDimensions.getEndzone() : fieldDimensions.getCentralZoneLength());
		// ...and then in totalFieldAndEndzonesLength
		return x + (position.is0EndZone() ? 0 : (position.isFieldArea() ? fieldDimensions.getEndzone() : fieldDimensions.getEndzone() + fieldDimensions.getCentralZoneLength()));
	}
}
