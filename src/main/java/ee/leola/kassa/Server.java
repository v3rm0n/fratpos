package ee.leola.kassa;

import ee.leola.kassa.controllers.Public;
import ee.leola.kassa.controllers.jade.Stocktakings;
import ee.leola.kassa.controllers.jade.Admin;
import ee.leola.kassa.controllers.jade.Index;
import ee.leola.kassa.controllers.rest.*;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.simple.SimpleContainerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.bridge.SLF4JBridgeHandler;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.io.Closeable;
import java.io.IOException;
import java.net.URI;

/**
 * Created by vermon on 30/03/14.
 */
public class Server {

    private static final Logger log = LoggerFactory.getLogger(Server.class);

    private static final URI BASE_URI = URI.create("http://localhost:8080/");

    public static void main(String... args) throws IOException {
        // Jersey uses java.util.logging - bridge to slf4
        SLF4JBridgeHandler.removeHandlersForRootLogger();
        SLF4JBridgeHandler.install();
        log.info("Starting server");
        URI baseUri = UriBuilder.fromUri("http://localhost/").port(8080).build();
        ResourceConfig config = new ResourceConfig(Index.class, Admin.class, Public.class, Feedbacks.class,
                Users.class, Statuses.class, Products.class, Transactions.class, Paytypes.class, Stocktakings.class,
                LogAllExceptionMapper.class);
        Closeable server = SimpleContainerFactory.create(baseUri, config);
        log.info("Server started");
    }

    @Provider
    public static class LogAllExceptionMapper implements ExceptionMapper<Throwable> {

        @Override
        public Response toResponse(Throwable e) {
            log.error(e.getMessage(), e);
            return Response.serverError().entity(e).build();
        }
    }

}
