package info.kaara.fratpos.is.model;

import info.kaara.fratpos.common.model.Model;
import info.kaara.fratpos.user.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.math.BigDecimal;

import static javax.persistence.DiscriminatorType.INTEGER;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorColumn(name = "recurring", discriminatorType = INTEGER)
@DiscriminatorValue("0")
public class UserObligation extends Model {
	private User user;
	private Obligation obligation;
	private BigDecimal amount;
}
