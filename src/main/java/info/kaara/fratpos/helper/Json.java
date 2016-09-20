package info.kaara.fratpos.helper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class Json {

	private static ObjectMapper mapper = new ObjectMapper();

	private final ObjectMapper objectMapper;

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
