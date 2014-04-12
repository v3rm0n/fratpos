package ee.leola.kassa.controllers.jade;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

/**
 * Created by vermon on 23/03/14.
 */
@Path("/admin")
public class Admin extends JadeController {

    @GET
    public Response index() {
        return ok(render("admin", "title", "Admin"));
    }

    @GET
    @Path("/{page}")
    public Response page(@PathParam("page") String page) {
        return ok(render("admin/" + page));
    }
}
