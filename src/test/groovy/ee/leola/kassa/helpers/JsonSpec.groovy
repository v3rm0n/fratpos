package ee.leola.kassa.helpers

import com.fasterxml.jackson.databind.JsonNode
import com.google.common.collect.Lists
import org.junit.Assert
import spock.lang.Specification

/**
 * Created by vermon on 08/10/14.
 */
class JsonSpec extends Specification {

    def "object to JSON"() {
        JsonNode node = Json.toJson(new TestModel());
        Assert.assertEquals("{\"string\":\"value\",\"integer\":10,\"list\":[\"value1\",\"value2\"]}", node.toString());
    }

    def "string to JSON"() throws IOException {
        JsonNode node = Json.toJson("{\"test\": \"value\"}");
        Assert.assertEquals("{\"test\":\"value\"}", node.toString());
    }

    private static class TestModel {
        String string = "value";
        Integer integer = 10;
        List<String> list = Lists.newArrayList("value1", "value2");
    }
}
