package com.summithill.ultimate.model.lightweights;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown=true)
public class EventPosition {
	private static final String FIELD_AREA = "field";
	private static final String ENDZONE0 = "0endzone";
	private static final String ENDZONE100 = "100endzone";
	private float x;
	private float y;
	private boolean inverted;
	private String area;
	
	public float getX() {
		return x;
	}
	public void setX(float x) {
		this.x = x;
	}
	public float getY() {
		return y;
	}
	public void setY(float y) {
		this.y = y;
	}
	public boolean isInverted() {
		return inverted;
	}
	public void setInverted(boolean inverted) {
		this.inverted = inverted;
	}
	public String getArea() {
		return area;
	}
	public void setArea(String area) {
		this.area = area;
	}
	public boolean isFieldArea() {
		return area.equals(FIELD_AREA);
	}
	public boolean is0EndZone() {
		return area.equals(ENDZONE0);
	}
	public boolean is100EndZone() {
		return area.equals(ENDZONE100);
	}
	public boolean isEndZone() {
		return !isFieldArea();
	}
	public EventPosition normalized() {
		if (inverted) {
			EventPosition position = new EventPosition();
			position.setX(1.0f - getX());
			position.setY(1.0f - getY());
			if (isEndZone()) {
				position.setArea(is0EndZone() ? ENDZONE100 : ENDZONE0);
			} else {
				position.setArea(area);
			}
			position.setInverted(false);
			return position;
		}
		return this;
	}
	public String getAreaDescription() {
		return isFieldArea() ? "Field" : (is0EndZone() ? "Endzone A" : "Endzone B");
	}
}



