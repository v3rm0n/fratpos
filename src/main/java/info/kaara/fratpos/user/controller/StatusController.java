package info.kaara.fratpos.user.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.pos.repository.StatusRepository;
import info.kaara.fratpos.user.model.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/statuses")
public class StatusController extends RestBaseController<Status, Long> {

	@Autowired
	public StatusController(StatusRepository statusRepository) {
		super(statusRepository, "ROLE_USERS");
	}
}
