package ee.leola.kassa.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Transaction extends Model {

  private boolean invalid;

  private Instant created = Instant.now();

  @NotNull @ManyToOne private User user;

  @OneToMany(cascade = CascadeType.ALL)
  @JoinTable(
      name = "transaction_transaction_product",
      joinColumns = @JoinColumn(name = "transaction_id", referencedColumnName = "id"),
      inverseJoinColumns =
          @JoinColumn(name = "transaction_product_id", referencedColumnName = "id"))
  private Set<TransactionProduct> products;

  @NotNull @ManyToOne private Paytype paytype;

  public String getFormattedTime() {
    return DateTimeFormatter.ISO_INSTANT.format(created);
  }

  public BigDecimal getSum() {
    BigDecimal sum = BigDecimal.ZERO;
    for (TransactionProduct product : products) {
      sum = sum.add(product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity())));
    }
    return sum;
  }

  @JsonProperty("paytype")
  public String getPaytypeName() {
    return paytype.getName();
  }
}
