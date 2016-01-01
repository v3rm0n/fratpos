package info.kaara.fratpos.is.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.is.model.Income;
import info.kaara.fratpos.is.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/incomes")
public class IncomeController extends RestBaseController<Income, Long> {

	@Autowired
	public IncomeController(IncomeRepository repo) {
		super(repo, "ROLE_INCOME");
	}
}
