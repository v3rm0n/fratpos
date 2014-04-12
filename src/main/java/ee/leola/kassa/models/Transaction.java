package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * Created by vermon on 23/03/14.
 */
@Entity
public class Transaction extends Model {

    private boolean invalid;

    private Date created = new Date();

    @ManyToOne
    private User user;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "transaction")
    private Set<TransactionProduct> products;

    @ManyToOne
    private Paytype paytype;

    public String getFormattedTime() {
        DateFormat df = new SimpleDateFormat("hh:mm dd.MM.YYYY");
        return df.format(created);
    }

    public BigDecimal getSum() {
        BigDecimal sum = BigDecimal.ZERO;
        for (Product product : products) {
            sum = sum.add(product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity())));
        }
        return sum;
    }

    public boolean isInvalid() {
        return invalid;
    }

    public void setInvalid(boolean invalid) {
        this.invalid = invalid;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Paytype getPaytype() {
        return paytype;
    }

    public void setPaytype(Paytype paytype) {
        this.paytype = paytype;
    }

    public Set<TransactionProduct> getProducts() {
        return products;
    }

    public void setProducts(Set<TransactionProduct> products) {
        this.products = products;
    }

    public static Query<Transaction> find() {
        return Ebean.find(Transaction.class);
    }

    public static List<Transaction> allValid() {
        return find().where("invalid = FALSE").findList();
    }
}
