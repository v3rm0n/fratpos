package info.kaara.fratpos.is.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.is.model.IncomeType;
import info.kaara.fratpos.is.repository.IncomeTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/incometype")
public class IncomeTypeController extends RestBaseController<IncomeType, Long> {

	@Autowired
	public IncomeTypeController(IncomeTypeRepository repo) {
		super(repo);
	}
}
