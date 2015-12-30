package info.kaara.fratpos.is.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.is.model.Obligation;
import info.kaara.fratpos.is.repository.ObligationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/obligation")
public class ObligationController extends RestBaseController<Obligation, Long> {

	@Autowired
	public ObligationController(ObligationRepository repo) {
		super(repo, "ROLE_OBLIGATIONS");
	}
}
