package info.kaara.fratpos.helper

import com.fasterxml.jackson.databind.JsonNode
import info.kaara.fratpos.pos.model.Status
import info.kaara.fratpos.user.model.User
import spock.lang.Specification

class JsonSpec extends Specification {

	def "object to JSON"() {
		when:
		JsonNode node = Json.toJson(new TestModel())
		then:
		"{\"string\":\"value\",\"integer\":10,\"list\":[\"value1\",\"value2\"]}" == node.toString()
	}

	def "string to JSON"() {
		when:
		JsonNode node = Json.toJson("{\"test\": \"value\"}")
		then:
		"{\"test\":\"value\"}" == node.toString()
	}

	def "status as name"() {
		given:
		User user = new User()
		Status status = new Status()
		status.name = "reb!"
		user.status = status
		when:
		JsonNode userJson = Json.toJson(user)
		then:
		"reb!" == userJson.get("status").get("name").asText()
	}

	private static class TestModel {
		String string = 'value'
		Integer integer = 10
		List<String> list = ["value1", "value2"]
	}
}
