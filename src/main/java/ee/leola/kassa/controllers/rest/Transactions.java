package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import java.math.BigDecimal;

@Path("/transaction")
public class Transactions extends RestController<Transaction> {

    private static final Logger log = LoggerFactory.getLogger(Transactions.class);

    @Override
    protected Class<Transaction> getModelClass() {
        return Transaction.class;
    }

    @POST
    @Path("/invalid/{id}")
    public Response invalidate(@PathParam("id") Long id) {
        invalidateTransaction(id);
        return ok();
    }

    @POST
    @Path("/invalid/admin/{id}")
    public Response invalidateAdmin(@PathParam("id") Long id) {
        invalidateTransaction(id);
        return ok();
    }

    private void invalidateTransaction(Long id) {
        Transaction transaction = Model.byId(Transaction.class, id);

        //Increment product quantities
        if (transaction.getPaytype().isAffectsQuantity()) {
            transaction.getProducts().stream().forEach(product -> {
                Product.incrementQuantity(product.getProductId(), product.getQuantity());
            });
        }

        if (transaction.getPaytype().isAffectsBalance()) {
            BigDecimal balance = transaction.getProducts().stream().map(TransactionProduct::getPrice).reduce(BigDecimal.ZERO, (b, price) -> {
                return b.add(price);
            });
            //Increment user balance
            User user = Model.byId(User.class, transaction.getUser().getId());
            user.setBalance(user.getBalance().add(balance));
            user.save();
        }

        transaction.setInvalid(true);
        transaction.update();
    }

    @POST
    @Path("/{id}")
    @Override
    public Response update(Transaction transaction) {
        return Response.status(Response.Status.METHOD_NOT_ALLOWED).build();
    }

    @POST
    @Override
    public Response create(Transaction transaction) {
        log.info("Saving new transaction {}", transaction);

        //Decrement product quantities
        if (transaction.getPaytype().isAffectsQuantity()) {
            transaction.getProducts().stream().forEach(product -> {
                product.setProductId(product.getId());
                Product.incrementQuantity(product.getProductId(), -product.getQuantity());
                product.setId(null);
            });
        } else {
            transaction.getProducts().stream().forEach(product -> {
                product.setProductId(product.getId());
                product.setId(null);
            });
        }

        if (transaction.getPaytype().isAffectsBalance()) {
            BigDecimal balance = transaction.getProducts().stream().map(TransactionProduct::getPrice).reduce(BigDecimal.ZERO, (b, price) -> {
                return b.subtract(price);
            });
            //Decrement user balance
            User user = Model.byId(User.class, transaction.getUser().getId());
            user.setBalance(user.getBalance().add(balance));
            user.save();
        }


        transaction.save();

        return ok(transaction.toJson());
    }
}
