package ee.leola.kassa.controllers;

import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.databind.node.ObjectNode;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.PopularProduct;
import ee.leola.kassa.models.Transaction;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created by vermon on 20/04/14.
 */
@Path("/stat")
@Produces("text/json")
public class Statistics extends Controller {

    @GET
    @Path("/{id}")
    public Response getStatistics(@PathParam("id") Long userId) {
        List<PopularProduct> prod = PopularProduct.find(userId);
        List<Transaction> transactions = Transaction.find().where(Ebean.getExpressionFactory().eq("user_id", userId)).findList();
        ObjectNode object = Json.newObject();
        object.set("popularProducts", Json.toJson(prod));
        object.set("transactions", Json.toJson(transactions));
        return ok(object);
    }
}
