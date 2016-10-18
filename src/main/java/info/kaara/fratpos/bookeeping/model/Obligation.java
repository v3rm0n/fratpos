package info.kaara.fratpos.bookeeping.model;

import info.kaara.fratpos.common.model.AuditableModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Obligation extends AuditableModel {
	@ManyToOne
	private JournalType journalType;
	private String description;
	private BigDecimal amount;
	@ManyToOne
	private Account account;
}
