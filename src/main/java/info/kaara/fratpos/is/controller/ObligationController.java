package info.kaara.fratpos.is.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.is.model.Obligation;
import info.kaara.fratpos.is.model.UserObligation;
import info.kaara.fratpos.is.repository.ObligationRepository;
import info.kaara.fratpos.is.repository.UserObligationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/obligations")
public class ObligationController extends RestBaseController<Obligation, Long> {

	private final UserObligationRepository userObligationRepository;

	public ObligationController(ObligationRepository repo, UserObligationRepository userObligationRepository) {
		super(repo, "ROLE_OBLIGATIONS");
		this.userObligationRepository = userObligationRepository;
	}

	@ResponseBody
	@RequestMapping("/{id}/userobligations")
	public ResponseEntity<Iterable<UserObligation>> listAll(@PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
		if (canRead(request)) {
			Obligation obligation = repo.findOne(id);
			List<UserObligation> userObligations = userObligationRepository.findByObligation(obligation);
			return new ResponseEntity<>(userObligations, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}
}
