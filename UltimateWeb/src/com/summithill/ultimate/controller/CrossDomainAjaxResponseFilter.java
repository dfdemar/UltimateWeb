package com.summithill.ultimate.controller;

import static java.util.logging.Level.SEVERE;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CrossDomainAjaxResponseFilter implements Filter {
//	private Logger log = Logger.getLogger(getClass().getName());

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain fc) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) req;		
		HttpServletResponse httpResponse = (HttpServletResponse) resp;
		
//		log.log(SEVERE, "CORS filter processing request.  httpRequest.getMethod() = " + httpRequest.getMethod());
		
		String corsOrigin = httpRequest.getHeader("Origin");

		if (corsOrigin != null) {
//			log.log(SEVERE, "Adding cors response headers for request type " + httpRequest.getMethod());
			httpResponse.setHeader("Access-Control-Allow-Origin", corsOrigin);
			httpResponse.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
			httpResponse.setHeader("Access-Control-Allow-Headers", httpRequest.getHeader("Access-Control-Request-Headers"));
			httpResponse.addHeader("Access-Control-Allow-Credentials", "true");
			httpResponse.addHeader("Vary", "Origin");
		}

		// only continue for no-OPTIONS requests
		if (!httpRequest.getMethod().equalsIgnoreCase("OPTIONS")) {
			fc.doFilter(req, resp);
		}
	}
	
	@Override
	public void destroy() {
		
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		
	}
	
}
