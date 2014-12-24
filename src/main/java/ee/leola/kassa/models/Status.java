package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.helpers.Json;

import javax.persistence.Entity;
import java.io.IOException;

@Entity
public class Status extends Model {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonCreator
    public static Status findByName(String name) {
        return Ebean.find(Status.class).where().eq("name", name).findUnique();
    }
}
