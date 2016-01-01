package info.kaara.fratpos.helper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Component
public class Json {

	private static ObjectMapper mapper;

	@Autowired
	private ObjectMapper objectMapper;

	@PostConstruct
	public void init() {
		mapper = objectMapper;
	}

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

	public static <T> T asObject(JsonNode jsonNode, Class<T> clazz) {
		return mapper.convertValue(jsonNode, clazz);
	}
}
