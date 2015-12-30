package info.kaara.fratpos.security.model;

import info.kaara.fratpos.common.model.Model;
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
public class Role extends Model {
	private String name;

	@ManyToMany
	@JoinTable(inverseJoinColumns = @JoinColumn(name = "permission_id"))
	private List<Permission> permissions;
}
