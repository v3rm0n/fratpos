package ee.leola.kassa.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * Created by vermon on 24/03/14.
 */
@Entity
public class TransactionProduct extends Product {

    @ManyToOne
    @JsonIgnore
    private Transaction transaction;

    public TransactionProduct() {
    }

    public TransactionProduct(Product product, Integer quantity) {
        setQuantity(quantity);
        setName(product.getName());
        setPrice(product.getPrice());
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }
}
