package com.summithill.ultimate.controller;

public class Wind {
	private int mph;
	private int degrees; 
	private boolean leftToRight;
	
	public int getMph() {
		return mph;
	}
	public void setMph(int mph) {
		this.mph = mph;
	}

	public boolean isLeftToRight() {
		return leftToRight;
	}
	public void setLeftToRight(boolean leftToRight) {
		this.leftToRight = leftToRight;
	}
	public int getDegrees() {
		return degrees;
	}
	public void setDegrees(int degrees) {
		this.degrees = degrees;
	}
	@Override
	public String toString() {
		return "Wind [mph=" + mph + ", degrees=" + degrees + ", leftToRight="
				+ leftToRight + "]";
	}


}
