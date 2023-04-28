package ee.leola.kassa.models;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Product extends Model {

  @NotNull private String name;

  @NotNull private BigDecimal price = BigDecimal.ZERO;

  private Integer quantity;

  public void incrementQuantity(Integer increment) {
    setQuantity(getQuantity() + increment);
  }
}
