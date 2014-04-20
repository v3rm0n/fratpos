package ee.leola.kassa;

import com.avaje.ebean.config.GlobalProperties;
import com.google.common.collect.Sets;
import ee.leola.kassa.controllers.Public;
import ee.leola.kassa.controllers.Statistics;
import ee.leola.kassa.controllers.jade.Index;
import ee.leola.kassa.controllers.rest.Rest;
import ee.leola.kassa.controllers.rest.Stocktakings;
import ee.leola.kassa.controllers.rest.Transactions;
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
import java.util.Set;

/**
 * Created by vermon on 30/03/14.
 */
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
        Set<Class<?>> classes = Sets.newHashSet(Index.class, Public.class, Stocktakings.class, Transactions.class,
                Statistics.class, LogAllExceptionMapper.class);
        classes.addAll(Rest.controllers);
        ResourceConfig config = new ResourceConfig(classes);
        Closeable server = SimpleContainerFactory.create(baseUri, config);
        log.info("Server started");
    }

    public static void initDB() throws LiquibaseException {
        ResourceAccessor ra = new ClassLoaderResourceAccessor();
        String defaultDS = GlobalProperties.get("datasource.default", null);
        log.info("Default DS is {}", defaultDS);
        String dbURL = GlobalProperties.get("datasource." + defaultDS + ".databaseUrl", null);
        String username = GlobalProperties.get("datasource." + defaultDS + ".username", null);
        String password = GlobalProperties.get("datasource." + defaultDS + ".password", null);
        Database db = DatabaseFactory.getInstance().openDatabase(dbURL, username, password, ra);
        Liquibase liquibase = new Liquibase("sql/changelog.xml", ra, db);
        liquibase.update("");
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
