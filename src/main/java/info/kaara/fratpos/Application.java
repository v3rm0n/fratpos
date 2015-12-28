package info.kaara.fratpos;

import info.kaara.fratpos.user.RolePermissionBootstrapListener;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
public class Application extends WebMvcConfigurerAdapter {

	public static void main(String... args) {
		SpringApplicationBuilder app = new SpringApplicationBuilder(Application.class);
		app.listeners(new RolePermissionBootstrapListener());
		app.run(args);
	}

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/pos").setViewName("pos");
		registry.addViewController("/login").setViewName("login");
	}
}
