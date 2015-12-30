package info.kaara.fratpos.helper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;

public class Json {

	private static final ObjectMapper mapper = new ObjectMapper();

	public static JsonNode toJson(Object obj) {
		return mapper.convertValue(obj, JsonNode.class);
	}

	public static JsonNode toJson(String str) {
		try {
			return mapper.readTree(str);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
