package ee.leola.kassa.models;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class TransactionProduct extends Model {

	@NotNull
	private String name;

	@NotNull
	private BigDecimal price = BigDecimal.ZERO;

	private Integer quantity;

	@OneToOne
	private Product product;

	public TransactionProduct() {
	}

	public TransactionProduct(Product product, Integer quantity) {
		setQuantity(quantity);
		setName(product.getName());
		setPrice(product.getPrice());
		setProduct(product);
	}
}
