package info.kaara.fratpos.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import info.kaara.fratpos.pos.model.Model;
import info.kaara.fratpos.security.model.Role;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@ToString(exclude = "password")
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

	@ManyToMany
	@JoinTable(inverseJoinColumns = @JoinColumn(name = "role_id"))
	private List<Role> roles;

	@OneToOne(mappedBy = "user")
	private UserProfile userProfile;

	@JsonIgnore
	private String password;

	private BigDecimal balance = BigDecimal.ZERO;

	public String getLabel() {
		return this.status.getName() + ' ' + this.firstName + ' ' + this.lastName +
				(this.beerName != null && this.beerName.length() > 0 ? " (" + this.beerName + ")" : "");
	}

}
