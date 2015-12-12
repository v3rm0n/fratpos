package ee.leola.kassa.models;

import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.helpers.Json;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Data
public abstract class Model {

	@Id
	@GeneratedValue
	private Long id;

	public JsonNode toJson() {
		return Json.toJson(this);
	}

}
