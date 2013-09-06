package com.summithill.ultimate.controller;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CrossDomainAjaxResponseFilter implements Filter {

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain fc) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) req;		
		HttpServletResponse httpResponse = (HttpServletResponse) resp;
		
		// insert the CORS response headers
		String corsOrigin = httpRequest.getHeader("Origin");
		if (corsOrigin != null) {
			httpResponse.setHeader("Access-Control-Allow-Origin", "*");
			httpResponse.setHeader("Access-Control-Request-Method", "*");
			httpResponse.setHeader("Access-Control-Allow-Headers", "x-requested-with");
			if (!"xdr".equals(req.getParameter("xdomain-protocol"))) {
				httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
			}
		}
		fc.doFilter(req, resp);
	}

	@Override
	public void destroy() {
		
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		
	}
	
}
