package info.kaara.fratpos.bookeeping.controller;

import info.kaara.fratpos.bookeeping.model.JournalType;
import info.kaara.fratpos.bookeeping.repository.JournalTypeRepository;
import info.kaara.fratpos.common.controller.RestBaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/journaltypes")
public class JournalTypeController extends RestBaseController<JournalType, Long> {

	public JournalTypeController(JournalTypeRepository repo) {
		super(repo);
	}
}
