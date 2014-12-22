package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.*;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.IOException;
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
    @Produces("text/csv")
    public Response getCSV(@PathParam("id") Long id) throws IOException {
        Stocktaking stocktaking = Model.byId(Stocktaking.class, id);
        StringBuilder template = new StringBuilder("Inventuur\n");
        template.append("Loomise aeg ").append(stocktaking.getFormattedTime()).append("\n\n");

        template.append("Kasutajad\nStaatus,Eesnimi,Perenimi,Õllenimi,Saldo\n");
        stocktaking.getUsers().forEach(user -> {
            template.append(String.format("%s,%s,%s,%s,%s\n",
                    user.get("status").asText(),
                    user.get("firstName").asText(),
                    user.get("lastName").asText(),
                    user.get("beerName").asText(),
                    user.get("balance").asText()));
        });
        template.append(",,,Summa,").append(stocktaking.getBalancesSum()).append("\n\n");

        template.append("Tehingud\nAeg,Nimi,Summa,Makseviis,Katkestatud\n");
        stocktaking.getTransactions().forEach(transaction -> {
            template.append(String.format("%s,%s,%s,%s,%s\n",
                    transaction.get("formattedTime").asText(),
                    transaction.get("user").get("label").asText(),
                    transaction.get("sum").asText(),
                    transaction.get("paytype").asText(),
                    transaction.get("invalid").asBoolean() ? "Jah" : "Ei"));
        });
        template.append(",Summa,").append(stocktaking.getTransactionsSum()).append("\n\n");

        template.append("Laoseis\nNimi,Hind,Kogus\n");
        stocktaking.getProducts().forEach(product -> {
            template.append(String.format("%s,%s,%s\n",
                    product.get("name").asText(),
                    product.get("price").asText(),
                    product.get("quantity").asText()));
        });
        template.append(",Kokku,").append(stocktaking.getProductsQuantity());
        return ok(template.toString());
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
