package ee.leola.kassa.models;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends Model {

  @NotNull private String firstName;
  @NotNull private String lastName;

  private String beerName;

  @NotNull @ManyToOne private Status status;

  private BigDecimal balance = BigDecimal.ZERO;

  public String getLabel() {
    return this.status.getName()
        + ' '
        + this.firstName
        + ' '
        + this.lastName
        + (this.beerName != null && this.beerName.length() > 0 ? " (" + this.beerName + ")" : "");
  }
}
