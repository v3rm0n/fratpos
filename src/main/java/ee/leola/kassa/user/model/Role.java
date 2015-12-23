package ee.leola.kassa.user.model;

import ee.leola.kassa.models.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Role extends Model {
	private String name;
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(inverseJoinColumns = @JoinColumn(name = "permission_id"))
	private List<Permission> permissions;
}
