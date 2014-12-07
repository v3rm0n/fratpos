package ee.leola.kassa.helpers;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.Lists;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.util.List;

/**
 * Created by vermon on 20/04/14.
 */
public class JsonTest {

    @Test
    public void testObjectToJson() {
        JsonNode node = Json.toJson(new TestModel());
        Assert.assertEquals("{\"string\":\"value\",\"integer\":10,\"list\":[\"value1\",\"value2\"]}", node.toString());
    }

    @Test
    public void testStringToJson() throws IOException {
        JsonNode node = Json.toJson("{\"test\": \"value\"}");
        Assert.assertEquals("{\"test\":\"value\"}", node.toString());
    }

    private static class TestModel {
        private String string = "value";
        private Integer integer = 10;
        private List<String> list = Lists.newArrayList("value1", "value2");

        public String getString() {
            return string;
        }

        public void setString(String string) {
            this.string = string;
        }

        public Integer getInteger() {
            return integer;
        }

        public void setInteger(Integer integer) {
            this.integer = integer;
        }

        public List<String> getList() {
            return list;
        }

        public void setList(List<String> list) {
            this.list = list;
        }
    }

}

