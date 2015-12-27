package info.kaara.fratpos.is.model;

import info.kaara.fratpos.pos.model.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class ObligationType extends Model {
	private String name;
}
