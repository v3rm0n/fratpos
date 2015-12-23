package ee.leola.kassa.user.model;

import ee.leola.kassa.models.Model;
import ee.leola.kassa.models.Status;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

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

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(inverseJoinColumns = @JoinColumn(name = "role_id"))
	private List<Role> roles;

	@OneToOne
	@PrimaryKeyJoinColumn
	private UserProfile userProfile;

	private String password;

	private BigDecimal balance = BigDecimal.ZERO;

	public String getLabel() {
		return this.status.getName() + ' ' + this.firstName + ' ' + this.lastName +
				(this.beerName != null && this.beerName.length() > 0 ? " (" + this.beerName + ")" : "");
	}

}
