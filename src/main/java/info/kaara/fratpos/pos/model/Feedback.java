package info.kaara.fratpos.pos.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Feedback extends Model {

	@NotNull
	private String content;

	private Date created = new Date();

	public String getFormattedTime() {
		DateFormat df = new SimpleDateFormat("HH:mm dd.MM.YYYY");
		return df.format(created);
	}

}
