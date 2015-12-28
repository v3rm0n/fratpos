package info.kaara.fratpos.security.preauth;

import info.kaara.fratpos.PosConfig;
import info.kaara.fratpos.security.model.Permission;
import info.kaara.fratpos.security.model.Role;
import info.kaara.fratpos.security.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@Slf4j
public class PreAuthenticatedUserDetailsService implements AuthenticationUserDetailsService<PreAuthenticatedAuthenticationToken> {

	@Autowired
	private PosConfig posConfig;

	@Autowired
	private RoleRepository roleRepository;

	@Override
	public UserDetails loadUserDetails(PreAuthenticatedAuthenticationToken token) throws UsernameNotFoundException {
		if (isPosUser(token.getPrincipal())) {
			log.info("Preauthenticated user is pos user");
			return createUserDetails(token.getPrincipal());
		} else {
			throw new UsernameNotFoundException("Preauthenticated user is not pos user: " + token.getPrincipal());
		}
	}

	private UserDetails createUserDetails(Object principal) {
		return new User(principal.toString(), "", getPosPermissions());
	}

	private List<GrantedAuthority> getPosPermissions() {
		Role posRole = roleRepository.findOneByName(posConfig.getRole());
		return posRole.getPermissions().stream().map(this::toGrantedAuthority).collect(toList());
	}

	private GrantedAuthority toGrantedAuthority(Permission permission) {
		return new SimpleGrantedAuthority("ROLE_" + permission.getName());
	}

	private boolean isPosUser(Object principal) {
		return posConfig.getPrincipal().equalsIgnoreCase(principal.toString());
	}
}
