package unit.kassa.helpers

import com.fasterxml.jackson.databind.JsonNode
import com.google.common.collect.Lists
import ee.leola.kassa.helpers.Json
import ee.leola.kassa.models.Status
import ee.leola.kassa.models.User
import spock.lang.Specification

/**
 * Created by vermon on 08/10/14.
 */
class JsonSpec extends Specification {

    def "object to JSON"() {
        when:
        JsonNode node = Json.toJson(new TestModel())
        then:
        "{\"string\":\"value\",\"integer\":10,\"list\":[\"value1\",\"value2\"]}" == node.toString()
    }

    def "string to JSON"() throws IOException {
        when:
        JsonNode node = Json.toJson("{\"test\": \"value\"}")
        then:
        "{\"test\":\"value\"}" == node.toString()
    }

    def "status as name"() {
        given:
        User user = new User();
        Status status = new Status();
        status.name = "reb!";
        user.status = status;
        when:
        JsonNode userJson = Json.toJson(user);
        then:
        "reb!" == userJson.get("status").asText()
    }

    private static class TestModel {
        String string = "value";
        Integer integer = 10;
        List<String> list = Lists.newArrayList("value1", "value2");
    }
}
