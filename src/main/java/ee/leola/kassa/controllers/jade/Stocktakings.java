package ee.leola.kassa.controllers.jade;

import ee.leola.kassa.controllers.jade.JadeController;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.Model;
import ee.leola.kassa.models.Stocktaking;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

/**
 * Created by vermon on 06/04/14.
 */
@Path("/stocktaking")
public class Stocktakings extends JadeController {

    @GET
    public Response all() {
        return ok(Json.toJson(Model.find(Stocktaking.class).findList()));
    }

    @GET
    @Path("/csv/{id}")
    public Response getCSV(@PathParam("id") Long id) {
        return Response.serverError().build();
    }

    @GET
    @Path("/html/{id}")
    public Response getHTML(@PathParam("id") Long id) {
        Stocktaking stocktaking = Model.byId(Stocktaking.class, id);
        return ok(render("stocktaking", "stocktaking", stocktaking));
    }

    @POST
    @Path("/generate")
    public Response generate() {
        Stocktaking stocktaking = new Stocktaking();
        stocktaking.save();
        return ok(stocktaking.toJson());
    }

}
