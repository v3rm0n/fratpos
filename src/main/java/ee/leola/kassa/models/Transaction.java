package ee.leola.kassa.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Transaction extends Model {

	private boolean invalid;

	private Date created = new Date();

	@NotNull
	@ManyToOne
	private User user;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "transaction_transaction_product",
			joinColumns = @JoinColumn(name = "transaction_id", referencedColumnName = "id"),
			inverseJoinColumns = @JoinColumn(name = "transaction_product_id", referencedColumnName = "id"))
	private Set<TransactionProduct> products;

	@NotNull
	@ManyToOne
	private Paytype paytype;

	public String getFormattedTime() {
		DateFormat df = new SimpleDateFormat("HH:mm dd.MM.YYYY");
		return df.format(created);
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
