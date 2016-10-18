package info.kaara.fratpos;

import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableJpaAuditing
public class AuditConfiguration {


	@Bean
	public AuditorAware<User> createAuditorProvider(UserRepository userRepository) {
		return new SecurityAuditor(userRepository);
	}

	@Bean
	public AuditingEntityListener createAuditingListener() {
		return new AuditingEntityListener();
	}

	@RequiredArgsConstructor
	public static class SecurityAuditor implements AuditorAware<User> {

		private final UserRepository userRepository;

		@Override
		public User getCurrentAuditor() {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			return userRepository.findByEmail(auth.getName());
		}
	}
}
