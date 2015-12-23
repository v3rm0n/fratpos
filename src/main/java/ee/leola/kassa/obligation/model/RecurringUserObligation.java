package ee.leola.kassa.obligation.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("1")
public class RecurringUserObligation extends UserObligation {
	private Date startDate;
	private Date endDate;
}
