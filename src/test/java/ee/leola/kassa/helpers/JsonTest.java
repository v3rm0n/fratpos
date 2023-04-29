package ee.leola.kassa.helpers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.models.Status;
import ee.leola.kassa.models.User;
import org.junit.jupiter.api.Test;

public class JsonTest {

  @Test
  public void objectToJson() {
    // when:
    JsonNode node = Json.toJson(new TestModel());
    // then:
    assertEquals(
        "{\"string\":\"value\",\"integer\":10,\"list\":[\"value1\",\"value2\"]}", node.toString());
  }

  @Test
  public void stringToJson() {
    // when:
    JsonNode node = Json.toJson("{\"test\": \"value\"}");
    // then:
    assertEquals("{\"test\":\"value\"}", node.toString());
  }

  @Test
  public void statusAsName() {
    // given:
    User user = new User();
    Status status = new Status();
    status.setName("reb!");
    user.setStatus(status);
    // when:
    JsonNode userJson = Json.toJson(user);
    // then:
    assertEquals("reb!", userJson.get("status").get("name").asText());
  }
}
