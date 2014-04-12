package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import javax.persistence.Entity;
import java.math.BigDecimal;

/**
 * Created by vermon on 23/03/14.
 */
@Entity
public class Product extends Model {

    private String name;

    private BigDecimal price;

    private int quantity;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public static Query<Product> find() {
        return Ebean.find(Product.class);
    }

}
