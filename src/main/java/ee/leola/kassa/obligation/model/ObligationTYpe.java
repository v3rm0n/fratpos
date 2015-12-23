package ee.leola.kassa.obligation.model;

import ee.leola.kassa.models.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class ObligationType extends Model {
	private String name;
}
