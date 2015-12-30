package info.kaara.fratpos.is.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.is.model.ObligationType;
import info.kaara.fratpos.is.repository.ObligationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/obligationtype")
public class ObligationTypeController extends RestBaseController<ObligationType, Long> {

	@Autowired
	public ObligationTypeController(ObligationTypeRepository repo) {
		super(repo, "ROLE_OBLIGATIONS");
	}
}
