package ee.leola.kassa.user.model;

import ee.leola.kassa.models.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Permission extends Model {
	private String name;
}
