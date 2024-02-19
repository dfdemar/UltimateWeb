package com.summithill.ultimate.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


// throws a 401 WITHOUT realm header (so that browser doesn't interrupt flow)
@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class PasswordRequiredException extends RuntimeException {
	private static final long serialVersionUID = 1L;
}
