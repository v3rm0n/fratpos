package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * Created by vermon on 23/03/14.
 */
@Entity
public class User extends Model {

    private String firstName;

    private String lastName;

    private String beerName;

    @ManyToOne
    private Status status;

    private int balance;

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

    public void setStatus(Status status) {
        this.status = status;
    }

    public int getBalance() {
        return balance;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }

    public static Query<User> find() {
        return Ebean.find(User.class);
    }
}
