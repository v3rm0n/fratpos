package info.kaara.fratpos.bookeeping.model;

import info.kaara.fratpos.common.model.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class AccountType extends Model {
	private String name;
}
