package info.kaara.fratpos.is.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("1")
public class RecurringUserObligation extends UserObligation {
	private LocalDate startDate;
	private LocalDate endDate;
}
