package ee.leola.kassa

import de.neuland.pug4j.PugConfiguration
import de.neuland.pug4j.spring.template.SpringTemplateLoader
import de.neuland.pug4j.spring.view.PugViewResolver
import org.springframework.context.MessageSource
import org.springframework.context.annotation.Configuration
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.core.io.ResourceLoader
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class ViewConfiguration(
    private val resourceLoader: ResourceLoader,
    private val messageSource: MessageSource,
) : WebMvcConfigurer {
    override fun addViewControllers(registry: ViewControllerRegistry) {
        registry.addViewController("/").setViewName("index")
        registry.addViewController("/admin").setViewName("admin")
    }

    override fun configureViewResolvers(registry: ViewResolverRegistry) {
        val viewResolver = PugViewResolver()
        viewResolver.setConfiguration(pugConfiguration())
        registry.viewResolver(viewResolver)
    }

    private fun pugConfiguration(): PugConfiguration {
        val pugConfiguration = PugConfiguration()
        pugConfiguration.isCaching = false
        pugConfiguration.templateLoader = templateLoader()
        pugConfiguration.sharedVariables = mapOf("t" to MessageResolver(messageSource))
        return pugConfiguration
    }

    private fun templateLoader(): SpringTemplateLoader {
        val templateLoader = SpringTemplateLoader()
        templateLoader.setResourceLoader(resourceLoader)
        templateLoader.setTemplateLoaderPath("classpath:/templates/")
        templateLoader.encoding = "UTF-8"
        templateLoader.setSuffix(".pug")
        return templateLoader
    }

    class MessageResolver(private val messageSource: MessageSource) {
        fun message(key: String): String {
            return messageSource.getMessage(key, null, LocaleContextHolder.getLocale())
        }
    }
}
