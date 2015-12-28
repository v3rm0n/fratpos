package info.kaara.fratpos.user.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/user")
public class UserController extends RestBaseController<User, Long> {

	private UserRepository userRepository;

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
}
