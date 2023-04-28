package ee.leola.kassa.models;

import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.helpers.Json;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Stocktaking extends Model {

  private Instant created = Instant.now();

  @Lob private String users;

  @Lob private String products;

  @Lob private String transactions;

  public String getFormattedTime() {
    return DateTimeFormatter.ISO_INSTANT.format(created);
  }

  public BigDecimal getBalancesSum() {
    BigDecimal sum = BigDecimal.ZERO;
    if (users != null) {
      for (JsonNode user : Json.toJson(users)) {
        BigDecimal balance = BigDecimal.valueOf(user.findValue("balance").asDouble());
        sum = sum.add(balance);
      }
    }
    return sum;
  }

  public BigDecimal getTransactionsSum() {
    BigDecimal sum = BigDecimal.ZERO;
    if (transactions != null) {
      for (JsonNode transaction : Json.toJson(transactions)) {
        if (!transaction.get("invalid").asBoolean()) {
          BigDecimal transactionSum = BigDecimal.valueOf(transaction.findValue("sum").asDouble());
          sum = sum.add(transactionSum);
        }
      }
    }
    return sum;
  }

  public Integer getProductsQuantity() {
    Integer quantity = 0;
    if (products != null) {
      for (JsonNode product : Json.toJson(products)) {
        Integer prodQuantity = product.findValue("quantity").asInt();
        quantity += prodQuantity;
      }
    }
    return quantity;
  }

  public Map<String, BigDecimal> getSums() {
    Map<String, BigDecimal> sums = new HashMap<>();
    if (transactions != null) {
      for (JsonNode transaction : Json.toJson(transactions)) {
        if (!transaction.get("invalid").asBoolean()) {
          String type = transaction.get("paytype").asText();
          BigDecimal sum = sums.get(type);
          if (sum == null) {
            sum = BigDecimal.ZERO;
          }
          BigDecimal current = BigDecimal.valueOf(transaction.get("sum").asDouble());
          sum = sum.add(current);
          sums.put(type, sum);
        }
      }
    }
    return sums;
  }

  public JsonNode getUsers() {
    return Json.toJson(users);
  }

  public JsonNode getProducts() {
    return Json.toJson(products);
  }

  public JsonNode getTransactions() {
    return Json.toJson(transactions);
  }
}
