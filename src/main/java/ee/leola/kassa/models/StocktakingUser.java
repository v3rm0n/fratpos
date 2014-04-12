package ee.leola.kassa.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * Created by vermon on 24/03/14.
 */
@Entity
public class StocktakingUser extends User {

    @ManyToOne
    @JsonIgnore
    private Stocktaking stocktaking;

    public Stocktaking getStocktaking() {
        return stocktaking;
    }

    public void setStocktaking(Stocktaking stocktaking) {
        this.stocktaking = stocktaking;
    }
}
