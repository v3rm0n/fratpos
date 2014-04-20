package ee.leola.kassa.controllers.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import ee.leola.kassa.Server;
import ee.leola.kassa.models.Feedback;
import liquibase.exception.LiquibaseException;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 * Created by vermon on 20/04/14.
 */
public class RestControllerTest {

    private static Long feedbackId;
    private RestController<Feedback> controller = new Rest.Feedbacks();

    @BeforeClass
    public static void setup() throws LiquibaseException {
        Server.initDB();
        Feedback f = new Feedback();
        f.setContent("test");
        f.save();
        feedbackId = f.getId();
    }

    @Test
    public void testAll() {
        ArrayNode response = (ArrayNode) controller.all().getEntity();
        Assert.assertEquals(1, response.size());
    }

    @Test
    public void testGet() {
        JsonNode node = (JsonNode) controller.get(feedbackId).getEntity();
        Assert.assertEquals(feedbackId.longValue(), node.get("id").asLong());
        Assert.assertEquals("test", node.get("content").asText());
    }

    @Test
    public void testSave() {
        Feedback f = new Feedback();
        f.setContent("test2");
        controller.save(f);
        Assert.assertEquals(2, Feedback.find().findRowCount());
    }

    @Test
    public void testDelete() {
        Integer initialCount = Feedback.find().findRowCount();
        controller.delete(feedbackId);
        Assert.assertEquals(initialCount - 1, Feedback.find().findRowCount());
    }
}
