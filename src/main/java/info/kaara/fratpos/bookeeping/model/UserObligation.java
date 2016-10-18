package info.kaara.fratpos.bookeeping.model;

import info.kaara.fratpos.common.model.Model;
import info.kaara.fratpos.user.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class UserObligation extends Model {
	@ManyToOne
	private User user;
	@ManyToOne
	private Obligation obligation;
	private BigDecimal amount;
	private LocalDate startDate;
	private LocalDate endDate;
}
