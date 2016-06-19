package com.summithill.ultimate.model.lightweights;

public class FieldDimensions {
	private int type; // UPA = 0, PRO = 1, WFDF = 2, Other
	private float width;
	private int um; // yards or meters (yards = 0)
	private float endzone; // exclusive of endzone
	private float centralZoneLength;
	private float brick;
	
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public float getWidth() {
		return width;
	}
	public void setWidth(float width) {
		this.width = width;
	}
	public int getUm() {
		return um;
	}
	public void setUm(int um) {
		this.um = um;
	}
	public float getEndzone() {
		return endzone;
	}
	public void setEndzone(float endzone) {
		this.endzone = endzone;
	}
	public float getCentralZoneLength() {
		return centralZoneLength;
	}
	public void setCentralZoneLength(float centralZoneLength) {
		this.centralZoneLength = centralZoneLength;
	}
	public float getBrick() {
		return brick;
	}
	public void setBrick(float brick) {
		this.brick = brick;
	}
	

}
