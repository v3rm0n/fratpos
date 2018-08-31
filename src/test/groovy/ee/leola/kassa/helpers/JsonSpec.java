package ee.leola.kassa.helpers;

import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.models.Status;
import ee.leola.kassa.models.User;
import lombok.Data;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class JsonSpec {

    @Test
    public void objectToJson() {
        //when:
        JsonNode node = Json.toJson(new TestModel());
        //then:
        assertEquals("{\"string\":\"value\",\"integer\":10,\"list\":[\"value1\",\"value2\"]}", node.toString());
    }

    @Test
    public void stringToJson() {
        //when:
        JsonNode node = Json.toJson("{\"test\": \"value\"}");
        //then:
        assertEquals("{\"test\":\"value\"}", node.toString());
    }

    @Test
    public void statusAsName() {
        //given:
        User user = new User();
        Status status = new Status();
        status.setName("reb!");
        user.setStatus(status);
        //when:
        JsonNode userJson = Json.toJson(user);
        //then:
        assertEquals("reb!", userJson.get("status").get("name").asText());
    }

    @Data
    private static class TestModel {
        private String string = "value";
        private Integer integer = 10;
        private List<String> list = new ArrayList<String>(Arrays.asList("value1", "value2"));
    }
}
