package ee.leola.kassa.models;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import ee.leola.kassa.helpers.Json;

import javax.persistence.Entity;
import javax.persistence.Lob;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by vermon on 23/03/14.
 */
@Entity
public class Stocktaking extends Model {

    private Date created = new Date();

    @Lob
    private String users;

    @Lob
    private String products;

    @Lob
    private String transactions;

    public String getFormattedTime() {
        DateFormat df = new SimpleDateFormat("HH:mm dd.MM.YYYY");
        return df.format(created);
    }

    public BigDecimal getBalancesSum() throws IOException {
        BigDecimal sum = BigDecimal.ZERO;
        if (users != null) {
            for (JsonNode user : Json.toJson(users)) {
                BigDecimal balance = BigDecimal.valueOf(user.findValue("balance").asDouble());
                sum = sum.add(balance);
            }
        }
        return sum;
    }

    public BigDecimal getTransactionsSum() throws IOException {
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

    public Integer getProductsQuantity() throws IOException {
        Integer quantity = 0;
        if (products != null) {
            for (JsonNode product : Json.toJson(products)) {
                Integer prodQuantity = product.findValue("quantity").asInt();
                quantity += prodQuantity;
            }
        }
        return quantity;
    }

    public Map<String, BigDecimal> getSums() throws IOException {
        Map<String, BigDecimal> sums = Maps.newHashMap();
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

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public List<JsonNode> getUsers() throws IOException {
        return Lists.newArrayList(Json.toJson(users));
    }

    public void setUsers(String users) {
        this.users = users;
    }

    public JsonNode getProducts() throws IOException {
        return Json.toJson(products);
    }

    public void setProducts(String products) {
        this.products = products;
    }

    public JsonNode getTransactions() throws IOException {
        return Json.toJson(transactions);
    }

    public void setTransactions(String transactions) {
        this.transactions = transactions;
    }
}
