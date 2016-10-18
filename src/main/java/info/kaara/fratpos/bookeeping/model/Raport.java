package info.kaara.fratpos.bookeeping.model;

import info.kaara.fratpos.common.model.AuditableModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Raport extends AuditableModel {

	private String name;

	@ManyToMany
	@JoinTable(name = "raport_journal",
			joinColumns = @JoinColumn(name = "raport_id", referencedColumnName = "id"),
			inverseJoinColumns = @JoinColumn(name = "journal_id", referencedColumnName = "id")
	)
	public List<Journal> journals;
}
