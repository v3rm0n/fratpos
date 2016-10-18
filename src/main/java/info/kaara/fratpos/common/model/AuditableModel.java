package info.kaara.fratpos.common.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import info.kaara.fratpos.user.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class AuditableModel extends Model {

	@CreatedDate
	private LocalDateTime dateCreated = LocalDateTime.now();
	@CreatedBy
	@ManyToOne
	@JsonIgnore
	private User createdBy;
}
