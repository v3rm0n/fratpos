package ee.leola.kassa;

import de.neuland.pug4j.PugConfiguration;
import de.neuland.pug4j.spring.template.SpringTemplateLoader;
import de.neuland.pug4j.spring.view.PugViewResolver;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration(proxyBeanMethods = false)
@RequiredArgsConstructor
public class ViewConfiguration implements WebMvcConfigurer {

  private final ResourceLoader resourceLoader;

  private final MessageSource messageSource;

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("index");
    registry.addViewController("/admin").setViewName("admin");
  }

  @Override
  public void configureViewResolvers(ViewResolverRegistry registry) {
    PugViewResolver viewResolver = new PugViewResolver();
    viewResolver.setConfiguration(getJadeConfiguration());
    registry.viewResolver(viewResolver);
  }

  private PugConfiguration getJadeConfiguration() {
    PugConfiguration jadeConfiguration = new PugConfiguration();
    jadeConfiguration.setCaching(false);
    jadeConfiguration.setTemplateLoader(getTemplateLoader());
    Map<String, Object> sharedVariables = new HashMap<>();
    sharedVariables.put("t", new MessageResolver(messageSource));
    jadeConfiguration.setSharedVariables(sharedVariables);
    return jadeConfiguration;
  }

  private SpringTemplateLoader getTemplateLoader() {
    SpringTemplateLoader templateLoader = new SpringTemplateLoader();
    templateLoader.setResourceLoader(resourceLoader);
    templateLoader.setTemplateLoaderPath("classpath:/templates/");
    templateLoader.setEncoding("UTF-8");
    templateLoader.setSuffix(".jade");
    return templateLoader;
  }

  @AllArgsConstructor
  public static class MessageResolver {

    private MessageSource messageSource;

    public String message(String key) {
      return messageSource.getMessage(key, null, LocaleContextHolder.getLocale());
    }
  }
}
