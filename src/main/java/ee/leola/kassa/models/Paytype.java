package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotNull;
import java.util.Set;

/**
 * Created by vermon on 23/03/14.
 */
@Entity
public class Paytype extends Model {

    @NotNull
    private String name;

    private boolean affectsBalance;

    private boolean affectsQuantity;

    @ManyToMany
    private Set<Status> allowedForStatus;

    public boolean isAllowed(Status status) {
        return allowedForStatus.contains(status);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isAffectsBalance() {
        return affectsBalance;
    }

    public void setAffectsBalance(boolean affectsBalance) {
        this.affectsBalance = affectsBalance;
    }

    public boolean isAffectsQuantity() {
        return affectsQuantity;
    }

    public void setAffectsQuantity(boolean affectsQuantity) {
        this.affectsQuantity = affectsQuantity;
    }

    public Set<Status> getAllowedForStatus() {
        return allowedForStatus;
    }

    public void setAllowedForStatus(Set<Status> allowedForStatus) {
        this.allowedForStatus = allowedForStatus;
    }

    public static Query<Paytype> find() {
        return Ebean.find(Paytype.class);
    }
}

