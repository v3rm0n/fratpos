package ee.leola.kassa.controllers.rest

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import ee.leola.kassa.Server
import ee.leola.kassa.models.Feedback
import spock.lang.Specification

/**
 * Created by vermon on 08/10/14.
 */
class RestControllerSpec extends Specification {

    private static Long feedbackId
    private RestController<Feedback> controller = new Rest.Feedbacks()

    def setupSpec() {
        Server.initDB()
        Feedback f = new Feedback()
        f.setContent("test")
        f.save()
        feedbackId = f.getId()
    }

    def "find all entities"() {
        when:
        ArrayNode response = controller.all().getEntity()
        then:
        response.size() == 1
    }

    def "get single entity by id"() {
        when:
        JsonNode node = controller.get(feedbackId).getEntity()
        then:
        feedbackId.longValue() == node.get("id").asLong()
        "test" == node.get("content").asText()
    }

    def "save entity"() {
        when:
        Feedback f = new Feedback()
        f.setContent("test2")
        controller.create(f)
        then:
        2 == Feedback.find().findRowCount()
    }

    def "delete entity"() {
        when:
        Integer initialCount = Feedback.find().findRowCount()
        controller.delete(feedbackId);
        then:
        initialCount - 1 == Feedback.find().findRowCount()
    }
}
