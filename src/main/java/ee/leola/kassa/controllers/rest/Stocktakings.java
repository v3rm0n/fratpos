package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.Product;
import ee.leola.kassa.models.Stocktaking;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.models.User;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import java.util.Set;

/**
 * Created by vermon on 06/04/14.
 */
@Path("/stocktaking")
public class Stocktakings extends RestController<Stocktaking> {

    @Override
    protected Class<Stocktaking> getModelClass() {
        return Stocktaking.class;
    }

    @GET
    @Path("/csv/{id}")
    public Response getCSV(@PathParam("id") Long id) {
        return Response.serverError().build();
    }

    @POST
    @Path("/{id}")
    @Override
    public Response update(Stocktaking s) {
        return Response.status(Response.Status.METHOD_NOT_ALLOWED).build();
    }

    @POST
    @Override
    public Response create(Stocktaking s) {
        Stocktaking stocktaking = new Stocktaking();

        Set<User> users = User.find().where("balance <> 0").findSet();
        stocktaking.setUsers(Json.toJson(users).toString());

        Set<Transaction> transactions = Transaction.find().findSet();
        stocktaking.setTransactions(Json.toJson(transactions).toString());
        transactions.forEach(transaction -> transaction.delete());

        Set<Product> products = Product.find().findSet();
        stocktaking.setProducts(Json.toJson(products).toString());

        stocktaking.save();

        return ok(stocktaking.toJson());
    }

}
