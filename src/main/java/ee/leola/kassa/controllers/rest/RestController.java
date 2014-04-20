package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.controllers.Controller;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;

/**
 * Created by vermon on 06/04/14.
 */
@Produces("text/json")
public abstract class RestController<T extends Model> extends Controller {

    private static final Logger log = LoggerFactory.getLogger(RestController.class);

    protected abstract Class<T> getModelClass();

    @GET
    public Response all() {
        log.info("Getting all objects of type {}", getModelClass());
        return ok(Json.toJson(Model.find(getModelClass()).findList()));
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Long id) {
        T model = Model.byId(getModelClass(), id);
        return ok(model.toJson());
    }

    @POST
    public Response save(T model) {
        log.info("Saving new object {}", model);
        if (model.getId() != null) {
            model.update();
        } else {
            model.save();
        }
        return ok(model.toJson());
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        log.info("Deleting object of type {} with id {}", getModelClass(), id);
        Model.delete(getModelClass(), id);
        return ok();
    }
}
