package ee.leola.kassa.models;

import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.helpers.Json;
import lombok.Data;

@Data
public class PopularProduct {

  private TransactionProduct product;

  private Long count;

  public PopularProduct(TransactionProduct product, Long count) {
    this.product = product;
    this.count = count;
  }

  public JsonNode toJson() {
    return Json.toJson(this);
  }
}
