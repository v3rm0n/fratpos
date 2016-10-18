package info.kaara.fratpos.bookeeping.model;

import info.kaara.fratpos.common.model.AuditableModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Account extends AuditableModel {

	private String name;
	@ManyToOne
	private AccountType accountType;

	public Account(String name, AccountType accountType) {
		this.name = name;
		this.accountType = accountType;
	}
}
