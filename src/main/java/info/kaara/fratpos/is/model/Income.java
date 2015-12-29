package info.kaara.fratpos.is.model;

import info.kaara.fratpos.pos.model.Model;
import info.kaara.fratpos.user.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Income extends Model {
	@ManyToOne
	private IncomeType incomeType;
	private Date dateCreated = new Date();
	private BigDecimal amount;
	@ManyToOne
	private User user;
}
