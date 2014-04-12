package ee.leola.kassa.controllers.jade;

import de.neuland.jade4j.Jade4J;
import de.neuland.jade4j.JadeConfiguration;
import de.neuland.jade4j.template.ClasspathTemplateLoader;
import de.neuland.jade4j.template.JadeTemplate;
import ee.leola.kassa.controllers.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;


public class JadeController extends Controller {

    private static final Logger log = LoggerFactory.getLogger(JadeController.class);

    private static final JadeConfiguration jade = new JadeConfiguration();
    private static final ResourceBundle messages = ResourceBundle.getBundle("messages", new UTF8Control());

    static {
        log.debug("Initializing Jade");
        jade.setTemplateLoader(new ClasspathTemplateLoader());
        jade.setMode(Jade4J.Mode.HTML);
        jade.setPrettyPrint(true);
        log.debug("Jade init done");
    }

    /**
     * Convenience method for rendering a template by name (without .jade
     * extension).
     */
    public static Response.ResponseBuilder render(String template) {
        return render(template, new HashMap<String, Object>());
    }

    /**
     * Convenience method for rendering a template by name (without .jade
     * extension) and some context variables.
     */
    public static Response.ResponseBuilder render(String template, Map<String, Object> context) {
        try {
            log.debug("Rendering template views/{}", template);
            JadeTemplate jadeTemplate = jade.getTemplate("views/" + template);
            return Response.ok(jade.renderTemplate(jadeTemplate, getContext(context)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Convenience method for rendering a template by name (without .jade
     * extension) and some context variables pass as varargs as pairs of
     * [name] [value] arguments.
     */
    public static Response.ResponseBuilder render(String template, Object... contextArgs) {
        assert contextArgs.length >= 2 && contextArgs.length % 2 == 0;
        Map<String, Object> context = new HashMap<String, Object>();
        for (int i = 0; i < contextArgs.length; i += 2) {
            context.put((String) contextArgs[i], contextArgs[i + 1]);
        }
        return render(template, context);
    }

    private static Map<String, Object> getContext(Map<String, Object> context) {
        Map<String, Object> extended = new HashMap<>(context);
        extended.put("t", new MessageResolver());
        return extended;
    }

    public static class MessageResolver {

        public String message(String key) {
            log.debug("Resolving message {}", key);
            return messages.getString(key);
        }
    }

    private static class UTF8Control extends ResourceBundle.Control {
        public ResourceBundle newBundle
                (String baseName, Locale locale, String format, ClassLoader loader, boolean reload)
                throws IllegalAccessException, InstantiationException, IOException {
            // The below is a copy of the default implementation.
            String bundleName = toBundleName(baseName, locale);
            String resourceName = toResourceName(bundleName, "properties");
            ResourceBundle bundle = null;
            InputStream stream = null;
            if (reload) {
                URL url = loader.getResource(resourceName);
                if (url != null) {
                    URLConnection connection = url.openConnection();
                    if (connection != null) {
                        connection.setUseCaches(false);
                        stream = connection.getInputStream();
                    }
                }
            } else {
                stream = loader.getResourceAsStream(resourceName);
            }
            if (stream != null) {
                try {
                    // Only this line is changed to make it to read properties files as UTF-8.
                    bundle = new PropertyResourceBundle(new InputStreamReader(stream, "UTF-8"));
                } finally {
                    stream.close();
                }
            }
            return bundle;
        }
    }
}
