package ee.leola.kassa.user.model;

import ee.leola.kassa.models.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import java.util.Date;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class UserProfile extends Model {
	private String email;
	private String phone;
	private String address;
	private Date birthdate;
}
