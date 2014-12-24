package ee.leola.kassa;

import com.avaje.ebean.config.GlobalProperties;
import com.fasterxml.jackson.databind.node.ObjectNode;
import ee.leola.kassa.controllers.rest.RestException;
import ee.leola.kassa.helpers.Json;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.exception.LiquibaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import liquibase.resource.ResourceAccessor;
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

public class Server {

    private static final Logger log = LoggerFactory.getLogger(Server.class);

    public static void main(String... args) throws IOException, LiquibaseException {
        run();
        initDB();
    }

    public static void run() {
        // Jersey uses java.util.logging - bridge to slf4
        SLF4JBridgeHandler.removeHandlersForRootLogger();
        SLF4JBridgeHandler.install();
        log.info("Starting server");
        URI baseUri = UriBuilder.fromUri("http://localhost/").port(8080).build();
        Closeable server = SimpleContainerFactory.create(baseUri, new ResourceConfig().packages(Server.class.getPackage().toString()));
        Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() {
                try {
                    log.info("Stopping server");
                    server.close();
                } catch (IOException e) {
                    log.error("Could not stop server", e);
                }
            }
        });
        log.info("Server started");
    }


    public static void initDB() throws LiquibaseException {
        ResourceAccessor ra = new ClassLoaderResourceAccessor();
        String defaultDS = GlobalProperties.get("datasource.default", null);
        log.info("Default DS is {}", defaultDS);
        String dbURL = GlobalProperties.get("datasource." + defaultDS + ".databaseUrl", null);
        String username = GlobalProperties.get("datasource." + defaultDS + ".username", null);
        String password = GlobalProperties.get("datasource." + defaultDS + ".password", null);
        log.info("Connecting to DB {}", dbURL);
        Database db = DatabaseFactory.getInstance().openDatabase(dbURL, username, password, ra);
        Liquibase liquibase = new Liquibase("sql/changelog.xml", ra, db);
        liquibase.update("");
    }

    @Provider
    public static class GenericExceptionMapper implements ExceptionMapper<Throwable> {

        @Override
        public Response toResponse(Throwable e) {
            log.error(e.getMessage(), e);
            ObjectNode error = Json.newObject();
            error.put("error", "Internal server error");
            return Response.serverError().entity(error).build();
        }
    }

    @Provider
    public static class RestExceptionMapper implements ExceptionMapper<RestException> {

        @Override
        public Response toResponse(RestException e) {
            log.error(e.getMessage(), e);
            return Response.serverError().entity(Json.toJson(e)).build();
        }
    }

}
