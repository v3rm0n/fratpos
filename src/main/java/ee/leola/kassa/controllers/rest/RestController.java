package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.controllers.Controller;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Produces("text/json")
public abstract class RestController<T extends Model> extends Controller {

    private final Logger log = LoggerFactory.getLogger(getClass());

    protected abstract Class<T> getModelClass();

    @GET
    public Response all() {
        log.info("Getting all objects");
        return ok(Json.toJson(Model.find(getModelClass()).findList()));
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Long id) {
        log.info("Getting object by id {}", id);
        T model = Model.byId(getModelClass(), id);
        return ok(model.toJson());
    }

    @POST
    public Response create(T model) {
        log.info("Creating new object {}", model);
        if (model.getId() != null) {
            model.update();
        } else {
            model.save();
        }
        return ok(model.toJson());
    }

    @POST
    @Path("/{id}")
    public Response update(T model) {
        log.info("Updating object {}", model);
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
        log.info("Deleting object with id {}", id);
        try {
            Model.delete(getModelClass(), id);
        } catch (Exception e) {
            String error = String.format("Could not delete object of type %s and id %d", getModelClass().toString(), id);
            throw new RestException(error, e);
        }
        return ok();
    }
}
