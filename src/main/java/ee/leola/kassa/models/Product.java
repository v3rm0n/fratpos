package ee.leola.kassa.models;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Product extends Model {

	@NotNull
	private String name;

	@NotNull
	private BigDecimal price = BigDecimal.ZERO;

	private Integer quantity;

	public void incrementQuantity(Integer increment) {
		setQuantity(getQuantity() + increment);
	}

}
