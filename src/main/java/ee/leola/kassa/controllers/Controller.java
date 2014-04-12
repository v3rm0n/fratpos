package ee.leola.kassa.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Response;
import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

/**
 * Created by vermon on 30/03/14.
 */
public class Controller {

    private static final Logger log = LoggerFactory.getLogger(Controller.class);

    public Response file(String path) throws URISyntaxException {
        URL url = Controller.class.getResource(path);
        if (url == null) {
            log.info("File not found {}", path);
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        URI uri = url.toURI();
        log.debug("Getting file for URI {}", uri);
        File file = new File(uri);
        if (file.exists()) {
            return ok(file);
        }
        log.info("File not found {}", uri);
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    public Response ok(Response.ResponseBuilder builder) {
        return builder.status(Response.Status.OK).build();
    }

    public Response ok(Object object) {
        return Response.ok(object).build();
    }

    public Response ok() {
        return Response.ok().build();
    }
}
