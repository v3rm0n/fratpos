package ee.leola.kassa.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotNull;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Paytype extends Model {

  @NotNull private String name;

  private boolean affectsBalance;

  private boolean affectsQuantity;

  @ManyToMany
  @JoinTable(
      name = "paytype_status",
      joinColumns = @JoinColumn(name = "paytype_id", referencedColumnName = "id"),
      inverseJoinColumns = @JoinColumn(name = "status_id", referencedColumnName = "id"))
  private Set<Status> allowedForStatus;

  public boolean isAllowed(Status status) {
    return allowedForStatus.contains(status);
  }
}
