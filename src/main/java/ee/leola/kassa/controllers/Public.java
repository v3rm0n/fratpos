package ee.leola.kassa.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import java.net.URISyntaxException;

/**
 * Created by vermon on 30/03/14.
 */
@Path("/public")
public class Public extends Controller {

    private static final Logger log = LoggerFactory.getLogger(Public.class);

    @GET
    @Path("/js/{file}")
    @Produces("application/javascript; charset=UTF-8")
    public Response getJavascript(@PathParam("file") String file) throws URISyntaxException {
        log.debug("Getting javascript file {}", file);
        return file("/public/js/" + file);
    }

    @GET
    @Path("/css/{file}")
    @Produces("text/css; charset=UTF-8")
    public Response getCSS(@PathParam("file") String file) throws URISyntaxException {
        log.debug("Getting css file {}", file);
        return file("/public/css/" + file);

    }

    @GET
    @Path("/fonts/{file:.*}")
    public Response getFont(@PathParam("file") String file) throws URISyntaxException {
        log.debug("Getting font {}", file);
        return file("/public/fonts/" + file);
    }

    @GET
    @Path("/img/{file:.*}")
    public Response getImage(@PathParam("file") String file) throws URISyntaxException {
        log.debug("Getting image file {}", file);
        return file("/public/img/" + file);
    }
}
