package ee.leola.kassa.models;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Feedback extends Model {

    @NotNull
    private String content;

    private Instant created = Instant.now();

    public String getFormattedTime() {
        return DateTimeFormatter.ISO_INSTANT.format(created);
    }

}
