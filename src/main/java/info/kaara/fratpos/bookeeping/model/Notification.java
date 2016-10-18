package info.kaara.fratpos.bookeeping.model;

import info.kaara.fratpos.common.model.AuditableModel;
import info.kaara.fratpos.user.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Notification extends AuditableModel {

	@ManyToOne
	private User user;

	private String type;
}
