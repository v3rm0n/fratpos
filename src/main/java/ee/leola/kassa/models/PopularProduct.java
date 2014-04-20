package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.RawSql;
import com.avaje.ebean.RawSqlBuilder;
import com.avaje.ebean.annotation.Sql;
import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.helpers.Json;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.util.List;

/**
 * Created by vermon on 20/04/14.
 */
@Entity
@Sql
public class PopularProduct {

    private static final String TOP_PRODUCT = "SELECT p.id, p.name, p.price, p.quantity, sum(tp.quantity) FROM product p, transaction t, transaction_product tp WHERE t.`user_id` = :userid AND t.id = tp.transaction_id AND t.invalid = FALSE and p.id = tp.product_id group by p.id order by sum(tp.quantity) desc;";

    @OneToOne
    private Product product;

    private Integer count;

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public static List<PopularProduct> find(Long userId) {
        RawSql sql = RawSqlBuilder.parse(TOP_PRODUCT)
                .columnMapping("p.id", "product.id")
                .columnMapping("p.name", "product.name")
                .columnMapping("p.quantity", "product.quantity")
                .columnMapping("p.price", "product.price")
                .columnMapping("sum(tp.quantity)", "count")
                .create();
        return Ebean.find(PopularProduct.class).setRawSql(sql).setParameter("userid", userId).findList();
    }

    public JsonNode toJson() {
        return Json.toJson(this);
    }

}
