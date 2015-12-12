package ee.leola.kassa.models;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends Model {

	@NotNull
	private String firstName;
	@NotNull
	private String lastName;

	private String beerName;

	@NotNull
	@ManyToOne
	private Status status;

	private BigDecimal balance = BigDecimal.ZERO;

	public String getLabel() {
		return this.status.getName() + ' ' + this.firstName + ' ' + this.lastName +
				(this.beerName != null && this.beerName.length() > 0 ? " (" + this.beerName + ")" : "");
	}

}
