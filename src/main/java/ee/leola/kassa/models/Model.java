package ee.leola.kassa.models;

import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.helpers.Json;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@MappedSuperclass
@Data
public abstract class Model {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  public JsonNode toJson() {
    return Json.toJson(this);
  }
}
