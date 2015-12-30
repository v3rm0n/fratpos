package info.kaara.fratpos.pos.model;

import info.kaara.fratpos.common.model.Model;
import info.kaara.fratpos.user.model.Status;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotNull;
import java.util.Set;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Paytype extends Model {

	@NotNull
	private String name;

	private boolean affectsBalance;

	private boolean affectsQuantity;

	@ManyToMany
	@JoinTable(name = "paytype_status",
			joinColumns = @JoinColumn(name = "paytype_id", referencedColumnName = "id"),
			inverseJoinColumns = @JoinColumn(name = "status_id", referencedColumnName = "id")
	)
	private Set<Status> allowedForStatus;

	public boolean isAllowed(Status status) {
		return allowedForStatus.contains(status);
	}

}

