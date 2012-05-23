package com.summithill.ultimate.statistics;

import java.util.ArrayList;
import java.util.List;

public class TeamStats {
	private WindEffect windEffect = new WindEffect();
	private List<TrendPoint> enduranceIntervals = new ArrayList<TrendPoint>();
	private List<TrendPoint> trendPoints = new ArrayList<TrendPoint>();
	private GoalsSummary goalSummary = new GoalsSummary();
	
	public TrendPoint addNewTrendPoint() {
		TrendPoint point = new TrendPoint();
		trendPoints.add(point);
		return point;
	}
	public WindEffect getWindEffect() {
		return windEffect;
	}
	public void setWindEffect(WindEffect windEffect) {
		this.windEffect = windEffect;
	}
	public List<TrendPoint> getEnduranceIntervals() {
		return enduranceIntervals;
	}
	public void setEnduranceIntervals(List<TrendPoint> enduranceIntervals) {
		this.enduranceIntervals = enduranceIntervals;
	}
	public List<TrendPoint> getTrendPoints() {
		return trendPoints;
	}
	public void setTrendPoints(List<TrendPoint> trendPoints) {
		this.trendPoints = trendPoints;
	}
	public GoalsSummary getGoalSummary() {
		return goalSummary;
	}
	public void setGoalSummary(GoalsSummary goalSummary) {
		this.goalSummary = goalSummary;
	}
}
