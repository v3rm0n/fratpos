package info.kaara.fratpos.bookeeping.controller;

import info.kaara.fratpos.helper.PermissionChecker;
import info.kaara.fratpos.bookeeping.model.Obligation;
import info.kaara.fratpos.bookeeping.model.UserObligation;
import info.kaara.fratpos.bookeeping.repository.ObligationRepository;
import info.kaara.fratpos.bookeeping.repository.UserObligationRepository;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserObligationController {

	private final ObligationRepository obligationRepository;

	private final UserRepository userRepository;

	private final UserObligationRepository userObligationRepository;

	@Delegate
	private PermissionChecker permissionChecker = new PermissionChecker("ROLE_OBLIGATIONS");

	@ResponseBody
	@RequestMapping("/{id}/obligations")
	public ResponseEntity<Iterable<UserObligation>> listAll(@PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
		if (canRead(request)) {
			User user = userRepository.findOne(id);
			List<UserObligation> userObligations = userObligationRepository.findByUser(user);
			return new ResponseEntity<>(userObligations, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(value = "/{id}/obligations", method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
	@ResponseBody
	public ResponseEntity<UserObligation> createObligation(@RequestBody UserObligation userObligation, @PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
		log.info("Creating new user obligation", userObligation);
		if (canModify(request)) {
			return new ResponseEntity<>(createUserObligation(userObligation, id), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	private UserObligation createUserObligation(UserObligation json, Long userId) {
		User user = userRepository.findOne(userId);
		Obligation obligation = obligationRepository.findOne(json.getObligation().getId());
		json.setUser(user);
		json.setObligation(obligation);
		return userObligationRepository.save(json);
	}

}
