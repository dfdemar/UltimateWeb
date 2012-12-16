package com.summithill.ultimate.controller;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;


public class MobileRestControllerTest {
	private MobileRestController controller;
		
	@Before
	public void setup() {
		controller = new MobileRestController();
	}
	
	@Test
	public void testVersionCheck() throws Exception {
		ParameterMetaInfo metaInfo = controller.getMetaInfo("1.0.3");
		assertFalse(metaInfo.isAppVersionAcceptable());
		
		metaInfo = controller.getMetaInfo("1.0.901");
		assertTrue(metaInfo.isAppVersionAcceptable());
		
		// invalid version
		metaInfo = controller.getMetaInfo("1.0");
		assertFalse(metaInfo.isAppVersionAcceptable());
	}
	

}
