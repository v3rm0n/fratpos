package info.kaara.fratpos.is.model;

import info.kaara.fratpos.common.model.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Obligation extends Model {
	@ManyToOne
	private ObligationType obligationType;
	private String description;
	private BigDecimal amount;
	private LocalDateTime created = LocalDateTime.now();
	private Boolean recurring = Boolean.FALSE;
	private LocalDate startDate;
	private LocalDate endDate;
}
