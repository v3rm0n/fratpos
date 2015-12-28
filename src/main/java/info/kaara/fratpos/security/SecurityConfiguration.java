package info.kaara.fratpos.security;

import info.kaara.fratpos.PosConfig;
import info.kaara.fratpos.security.preauth.PreAuthenticatedUserDetailsService;
import info.kaara.fratpos.security.preauth.SubjectDNHeaderAuthenticationFilter;
import info.kaara.fratpos.security.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationProvider;
import org.springframework.security.web.authentication.preauth.RequestHeaderAuthenticationFilter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthenticationService authenticationService;

	@Autowired
	private PreAuthenticatedUserDetailsService preAuthenticatedUserDetailsService;

	@Autowired
	private PosConfig posConfig;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.addFilter(preauthFilter())
				.authorizeRequests()
				.antMatchers("/webjars/**", "/css/**").permitAll()
				.anyRequest().authenticated()
				.and().formLogin().loginPage("/login").permitAll()
				.and().logout().permitAll();
	}

	@Bean
	public RequestHeaderAuthenticationFilter preauthFilter() throws Exception {
		SubjectDNHeaderAuthenticationFilter requestHeaderAuthenticationFilter = new SubjectDNHeaderAuthenticationFilter();
		requestHeaderAuthenticationFilter.setSubjectDnRegex("emailAddress=(.*?)(?:/|$)");
		requestHeaderAuthenticationFilter.setPrincipalRequestHeader(posConfig.getHeader());
		requestHeaderAuthenticationFilter.setExceptionIfHeaderMissing(false);
		requestHeaderAuthenticationFilter.setAuthenticationManager(authenticationManager());
		return requestHeaderAuthenticationFilter;
	}

	@Bean
	public PreAuthenticatedAuthenticationProvider preauthAuthProvider() {
		PreAuthenticatedAuthenticationProvider preauthAuthProvider = new PreAuthenticatedAuthenticationProvider();
		preauthAuthProvider.setPreAuthenticatedUserDetailsService(preAuthenticatedUserDetailsService);
		return preauthAuthProvider;
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(preauthAuthProvider())
				.userDetailsService(authenticationService).passwordEncoder(new BCryptPasswordEncoder());
	}
}
