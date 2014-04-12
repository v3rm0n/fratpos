package ee.leola.kassa.models;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Date;
import java.util.Set;

/**
 * Created by vermon on 23/03/14.
 */
@Entity
public class Stocktaking extends Model {

    private Date created = new Date();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "stocktaking")
    private Set<StocktakingUser> users;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "stocktaking")
    private Set<StocktakingProduct> products;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "stocktaking")
    private Set<StocktakingTransaction> transactions;

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Set<StocktakingUser> getUsers() {
        return users;
    }

    public void setUsers(Set<StocktakingUser> users) {
        this.users = users;
    }

    public Set<StocktakingProduct> getProducts() {
        return products;
    }

    public void setProducts(Set<StocktakingProduct> products) {
        this.products = products;
    }

    public Set<StocktakingTransaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(Set<StocktakingTransaction> transactions) {
        this.transactions = transactions;
    }
}
