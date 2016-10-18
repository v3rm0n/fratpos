package info.kaara.fratpos.bookeeping.controller;

import info.kaara.fratpos.bookeeping.model.AccountType;
import info.kaara.fratpos.bookeeping.repository.AccountTypeRepository;
import info.kaara.fratpos.common.controller.RestBaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounttypes")
public class AccountTypeController extends RestBaseController<AccountType, Long> {

	public AccountTypeController(AccountTypeRepository accountTypeRepository) {
		super(accountTypeRepository);
	}
}
