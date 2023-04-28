package ee.leola.kassa.models;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Feedback extends Model {

  @NotNull private String content;

  private Instant created = Instant.now();

  public String getFormattedTime() {
    return DateTimeFormatter.ISO_INSTANT.format(created);
  }
}
