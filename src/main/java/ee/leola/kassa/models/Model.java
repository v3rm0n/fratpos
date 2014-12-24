package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;
import com.fasterxml.jackson.databind.JsonNode;
import ee.leola.kassa.helpers.Json;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class Model {

    @Id
    @GeneratedValue
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void delete() {
        Ebean.delete(this);
    }

    public void save() {
        Ebean.save(this);
    }

    public void update() {
        Ebean.update(this);
    }

    public JsonNode toJson() {
        return Json.toJson(this);
    }

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }

    public static void delete(Class<?> clazz, Long id) {
        Ebean.delete(clazz, id);
    }

    public static <T extends Model> Query<T> find(Class<T> model) {
        return Ebean.find(model);
    }

    public static <T extends Model> T byId(Class<T> model, Long id) {
        return Ebean.find(model, id);
    }


}
