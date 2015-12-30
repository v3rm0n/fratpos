package info.kaara.fratpos.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import info.kaara.fratpos.common.model.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
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

	public String getFormattedBirthdate() {
		if (birthdate != null) {
			DateFormat df = new SimpleDateFormat("HH:mm dd.MM.yyyy");
			return df.format(birthdate);
		} else {
			return null;
		}
	}

	@OneToOne
	@JsonIgnore
	private User user;
}
