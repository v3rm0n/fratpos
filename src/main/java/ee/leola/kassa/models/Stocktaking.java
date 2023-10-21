package ee.leola.kassa.models;

import com.fasterxml.jackson.databind.JsonNode;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Stocktaking extends Model {

    private Instant created = Instant.now();

    @Lob
    @Getter
    @Type(JsonType.class)
    private JsonNode users;

    @Lob
    @Getter
    @Type(JsonType.class)
    private JsonNode products;

    @Lob
    @Getter
    @Type(JsonType.class)
    private JsonNode transactions;

    public String getFormattedTime() {
        return DateTimeFormatter.ISO_INSTANT.format(created);
    }

    public BigDecimal getBalancesSum() {
        BigDecimal sum = BigDecimal.ZERO;
        if (users != null) {
            for (JsonNode user : users) {
                BigDecimal balance = BigDecimal.valueOf(user.findValue("balance").asDouble());
                sum = sum.add(balance);
            }
        }
        return sum;
    }

    public BigDecimal getTransactionsSum() {
        BigDecimal sum = BigDecimal.ZERO;
        if (transactions != null) {
            for (JsonNode transaction : transactions) {
                if (!transaction.get("invalid").asBoolean()) {
                    BigDecimal transactionSum = BigDecimal.valueOf(transaction.findValue("sum").asDouble());
                    sum = sum.add(transactionSum);
                }
            }
        }
        return sum;
    }

    public Integer getProductsQuantity() {
        int quantity = 0;
        if (products != null) {
            for (JsonNode product : products) {
                int prodQuantity = product.findValue("quantity").asInt();
                quantity += prodQuantity;
            }
        }
        return quantity;
    }

    public Map<String, BigDecimal> getSums() {
        Map<String, BigDecimal> sums = new HashMap<>();
        if (transactions != null) {
            for (JsonNode transaction : transactions) {
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
}
