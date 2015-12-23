package ee.leola.kassa.obligation.model;

import ee.leola.kassa.models.Model;
import ee.leola.kassa.user.model.User;
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
	private Date dateCreated;
	private BigDecimal amount;
	@ManyToOne
	private User user;
}
