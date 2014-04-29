package com.summithill.ultimate.util;

import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtil {
	
	public static String jsonHash(String json) {
		try {
			HashMap<String,Object> map = new ObjectMapper().readValue(json, new TypeReference<HashMap<String,Object>>() {});
			MessageDigest md = MessageDigest.getInstance("MD5");
			updateDigest(md, map);
			return md.toString();
		} catch (Exception e) {
			logError("Unable to compute json hash because of error: " + e.getMessage(), e);
			return null;
		} 
	}
	
	private static void updateDigest(MessageDigest md, Map<String,Object> map) {
		List<String> sortedKeys = sortedKeys(map);
		for (String key : sortedKeys) {
			Object value = map.get(key);
			if (value instanceof Collection<?>) {
				updateDigest(md, (Collection<?>)value);
			} else if (value instanceof Map<?, ?>) {
				updateDigest(md, (Map<String,Object>)map);
			} else {
				updateDigest(md, value);
			}
		}
	}
	
	private static void updateDigest(MessageDigest md, Collection<?> values) {
		for (Object value : values) {
			updateDigest(md, value);
		}
	}
	
	private static List<String> sortedKeys(Map<String,Object> map) {
		List<String> keys = new ArrayList<String>(map.keySet());
		Collections.sort(keys);
		return keys;
	}

	private static void updateDigest(MessageDigest md, Object value) {
		String updateValue = value == null ? "null" : value.toString();
		md.update(updateValue.getBytes());
	}
	
	private static void logError(String message, Exception e) {
		Logger.getLogger(JsonUtil.class.getName()).log(Level.SEVERE, message, e);
	}

}
