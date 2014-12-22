package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Created by vermon on 23/03/14.
 */
@Entity
public class User extends Model {

    @NotNull
    private String firstName;
    @NotNull
    private String lastName;

    private String beerName;

    @NotNull
    @ManyToOne
    private Status status;

    private BigDecimal balance = BigDecimal.ZERO;

    public String getLabel() {
        String fullName = this.status.getName() + ' ' + this.firstName + ' ' + this.lastName +
                (this.beerName != null && this.beerName.length() > 0 ? " (" + this.beerName + ")" : "");
        return fullName;
    }

    public void setLabel(String label) {
        //Ignore
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBeerName() {
        return beerName;
    }

    public void setBeerName(String beerName) {
        this.beerName = beerName;
    }

    public Status getStatus() {
        return status;
    }

    @JsonProperty("status")
    public String getStatusName() {
        return status.getName();
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public static Query<User> find() {
        return Ebean.find(User.class);
    }
}
