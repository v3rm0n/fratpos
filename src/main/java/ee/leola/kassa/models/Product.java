package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
public class Product extends Model {

    @NotNull
    private String name;

    @NotNull
    private BigDecimal price = BigDecimal.ZERO;

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

    public static void incrementQuantity(Long id, int increment) {
        Product p = byId(Product.class, id);
        p.setQuantity(p.getQuantity() + increment);
        p.save();
    }

}
