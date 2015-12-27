package info.kaara.fratpos.user;

import info.kaara.fratpos.user.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsByNameServiceWrapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationProvider;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.authentication.preauth.RequestHeaderAuthenticationFilter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthenticationService authenticationService;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.addFilter(getPreauthFilter())
				.authorizeRequests()
				.antMatchers("/webjars/**", "/css/**").permitAll()
				.anyRequest().authenticated()
				.and().formLogin().loginPage("/login").permitAll()
				.and().logout().permitAll();
	}

	@Bean
	public RequestHeaderAuthenticationFilter getPreauthFilter() throws Exception {
		RequestHeaderAuthenticationFilter requestHeaderAuthenticationFilter = new RequestHeaderAuthenticationFilter();
		requestHeaderAuthenticationFilter.setPrincipalRequestHeader("POS_USER");
		requestHeaderAuthenticationFilter.setExceptionIfHeaderMissing(false);
		requestHeaderAuthenticationFilter.setAuthenticationManager(authenticationManager());
		return requestHeaderAuthenticationFilter;
	}

	@Bean
	public PreAuthenticatedAuthenticationProvider preauthAuthProvider() {
		PreAuthenticatedAuthenticationProvider preauthAuthProvider = new PreAuthenticatedAuthenticationProvider();
		preauthAuthProvider.setPreAuthenticatedUserDetailsService(userDetailsServiceWrapper());
		return preauthAuthProvider;
	}

	@Bean
	public UserDetailsByNameServiceWrapper<PreAuthenticatedAuthenticationToken> userDetailsServiceWrapper() {
		UserDetailsByNameServiceWrapper<PreAuthenticatedAuthenticationToken> wrapper = new UserDetailsByNameServiceWrapper<>();
		wrapper.setUserDetailsService(authenticationService);
		return wrapper;
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(preauthAuthProvider())
				.userDetailsService(authenticationService).passwordEncoder(new BCryptPasswordEncoder());
	}
}
