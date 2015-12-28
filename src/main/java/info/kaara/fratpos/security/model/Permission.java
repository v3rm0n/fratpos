package info.kaara.fratpos.security.model;

import info.kaara.fratpos.pos.model.Model;
import lombok.*;

import javax.persistence.Entity;

@Entity
@Data
@RequiredArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Permission extends Model {
	@NonNull
	private String name;
}
