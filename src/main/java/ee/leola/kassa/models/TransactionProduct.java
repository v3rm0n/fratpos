package ee.leola.kassa.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class TransactionProduct extends Product {

    @ManyToOne
    @JsonIgnore
    private Transaction transaction;

    private Long productId;

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

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
