package info.kaara.fratpos.is.model;

import info.kaara.fratpos.common.model.Model;
import info.kaara.fratpos.user.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Notification extends Model {

	@ManyToOne
	private User user;

	private String type;

	private LocalDateTime created = LocalDateTime.now();
}
