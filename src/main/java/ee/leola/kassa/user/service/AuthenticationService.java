package ee.leola.kassa.user.service;

import ee.leola.kassa.user.model.Permission;
import ee.leola.kassa.user.model.Role;
import ee.leola.kassa.user.model.User;
import ee.leola.kassa.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;

import static java.util.stream.Collectors.toSet;

@Slf4j
@Service
public class AuthenticationService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username);
		if (user == null) {
			throw new UsernameNotFoundException("Username not found: " + username);
		}
		return convertToUserDetails(user);
	}

	private UserDetails convertToUserDetails(User user) {
		return new org.springframework.security.core.userdetails.User(user.getUserProfile().getEmail(), user.getPassword(), convertToGrantedAuthorities(user.getRoles()));
	}

	private static Set<GrantedAuthority> convertToGrantedAuthorities(Collection<Role> roles) {
		log.info("Roles: {}", roles);
		return roles.stream().flatMap(role -> role.getPermissions().stream()).map(Permission::getName).map(SimpleGrantedAuthority::new).collect(toSet());
	}
}
