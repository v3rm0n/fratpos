package ee.leola.kassa.controllers.jade;

import com.fasterxml.jackson.databind.node.ObjectNode;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.Paytype;
import ee.leola.kassa.models.Product;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Path("/")
public class Index extends JadeController {

    private static final Logger log = LoggerFactory.getLogger(Index.class);

    @GET
    public Response index() {
        return ok(render("index", "title", "Kassa"));
    }

    @GET
    @Path("/dialog/{modal}")
    public Response modal(@PathParam("modal") String modal) {
        log.debug("Opening modal {}", modal);
        return ok(render("dialog/" + modal));
    }

    @GET
    @Path("/posdata")
    @Produces("text/json")
    public Response getPosData() {
        log.debug("Getting POS data");
        ObjectNode result = Json.newObject();
        result.put("users", Json.toJson(User.find().findList()));
        result.put("products", Json.toJson(Product.find().findList()));
        result.put("paytypes", Json.toJson(Paytype.find().findList()));
        result.put("transactions", Json.toJson(Transaction.allValid()));
        return ok(result);
    }

    @GET
    @Path("/admin")
    public Response admin() {
        return ok(render("admin", "title", "Admin"));
    }

    @GET
    @Path("/admin/{page}")
    public Response page(@PathParam("page") String page) {
        log.debug("Opening admin page {}", page);
        return ok(render("admin/" + page));
    }
}
