package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.Model;
import ee.leola.kassa.models.Transaction;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

/**
 * Created by vermon on 06/04/14.
 */
@Path("/transaction")
public class Transactions extends RestController<Transaction> {
    @Override
    protected Class<Transaction> getModelClass() {
        return Transaction.class;
    }

    @POST
    @Path("/invalid/{id}")
    public Response invalidate(@PathParam("id") Long id) {
        Transaction transaction = Model.byId(Transaction.class, id);
        transaction.setInvalid(true);
        transaction.update();
        return ok();
    }

    @POST
    @Path("/invalid/admin/{id}")
    public Response invalidateAdmin(@PathParam("id") Long id) {
        Transaction transaction = Model.byId(Transaction.class, id);
        transaction.setInvalid(true);
        transaction.update();
        return ok();
    }
}
