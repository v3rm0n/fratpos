package ee.leola.kassa.helpers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by vermon on 30/03/14.
 */
public class Json {

    public static ObjectNode newObject() {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.createObjectNode();
    }

    public static ArrayNode newArray() {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.createArrayNode();
    }

    public static JsonNode toJson(Object obj) {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(obj, JsonNode.class);
    }

    public static JsonNode toJson(String str) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readTree(str);
    }
}