package info.kaara.fratpos.user.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.security.model.Role;
import info.kaara.fratpos.security.repository.RoleRepository;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping(value = "/user")
public class UserController extends RestBaseController<User, Long> {

	@Autowired
	private RoleRepository roleRepository;

	private UserRepository userRepository;

	private final Object UPDATE_LOCK = new Object();

	@Autowired
	public UserController(UserRepository userRepository) {
		super(userRepository, "ROLE_USERS");
		this.userRepository = userRepository;
	}

	@RequestMapping(value = "/me", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<User> get(SecurityContextHolderAwareRequestWrapper request) {
		if (canRead(request)) {
			String email = request.getRemoteUser();
			User me = userRepository.findByEmail(email);
			if (me != null) {
				return new ResponseEntity<>(me, HttpStatus.OK);
			}
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(value = "/{id}/role/{roleId}", method = RequestMethod.PUT)
	@ResponseBody
	public ResponseEntity<User> addRole(@PathVariable("roleId") Long roleId, @PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
		if (canModify(request)) {
			synchronized (UPDATE_LOCK) {
				User user = repo.findOne(id);
				Role role = roleRepository.findOne(roleId);
				if (!user.getRoles().contains(role)) {
					log.info("Adding role {} to user {}", role.getName(), user.getLabel());
					user.getRoles().add(role);
					repo.save(user);
				}
			}
			return new ResponseEntity<>(HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(value = "/{id}/role/{roleId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Role> removeRole(@PathVariable("roleId") Long roleId, @PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
		if (canModify(request)) {
			synchronized (UPDATE_LOCK) {
				User user = repo.findOne(id);
				Role role = roleRepository.findOne(roleId);
				if (user.getRoles().contains(role)) {
					log.info("Removing role {} from user {}", role.getName(), user.getLabel());
					user.getRoles().remove(role);
					repo.save(user);
				}
			}
			return new ResponseEntity<>(HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}
}
