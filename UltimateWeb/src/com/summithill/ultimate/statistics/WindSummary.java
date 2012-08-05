package com.summithill.ultimate.statistics;

import com.summithill.ultimate.controller.Wind;

public class WindSummary {
	private WindEffect windUnkown = new WindEffect(new WindSpeedRange(0, 0));
	private WindEffect lowWind = new WindEffect(new WindSpeedRange(1, 10));
	private WindEffect strongWind = new WindEffect(new WindSpeedRange(11, 99));;
	
	public WindEffect getLowWind() {
		return lowWind;
	}
	public void setLowWind(WindEffect lowWind) {
		this.lowWind = lowWind;
	}
	public WindEffect getStrongWind() {
		return strongWind;
	}
	public void setStrongWind(WindEffect strongWind) {
		this.strongWind = strongWind;
	}
	
	public WindEffect findWindEffectBucket(Wind wind) {
		if (wind == null || wind.getMph() <= 0) {
			return windUnkown;
		}
		return wind.getMph() > lowWind.getSpeedRange().getTo() ? strongWind : lowWind;
	}
	public WindEffect getWindUnkown() {
		return windUnkown;
	}
	public void setWindUnkown(WindEffect windUnkown) {
		this.windUnkown = windUnkown;
	}
}
