package info.kaara.fratpos.common.model;

import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;

@MappedSuperclass
@Data
public abstract class Model implements Serializable {

	@Id
	@GeneratedValue
	private Long id;

}