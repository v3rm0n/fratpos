package info.kaara.fratpos.bookeeping.controller;

import info.kaara.fratpos.bookeeping.model.Raport;
import info.kaara.fratpos.bookeeping.repository.RaportRepository;
import info.kaara.fratpos.common.controller.RestBaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/raports")
public class RaportController extends RestBaseController<Raport, Long> {

	public RaportController(RaportRepository repo) {
		super(repo);
	}
}
