package info.kaara.fratpos.bookeeping.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import info.kaara.fratpos.common.model.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Posting extends Model {

	@ManyToOne
	private Account account;

	@ManyToOne
	@JsonIgnore
	private Journal journal;

	private BigDecimal amount;

	private Boolean credit = Boolean.FALSE;

}
