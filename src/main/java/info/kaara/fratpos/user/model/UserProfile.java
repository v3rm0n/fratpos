package info.kaara.fratpos.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import info.kaara.fratpos.pos.model.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.util.Date;

@Entity
@Data
@ToString(exclude = "user")
@EqualsAndHashCode(callSuper = true, exclude = "user")
public class UserProfile extends Model {

	private String email;
	private String phone;
	private String address;
	private Date birthdate;

	@OneToOne
	@JsonIgnore
	private User user;
}
