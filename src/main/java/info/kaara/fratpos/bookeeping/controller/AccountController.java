package info.kaara.fratpos.bookeeping.controller;

import info.kaara.fratpos.bookeeping.model.Account;
import info.kaara.fratpos.bookeeping.repository.AccountRepository;
import info.kaara.fratpos.common.controller.RestBaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts")
public class AccountController extends RestBaseController<Account, Long> {

  public AccountController(AccountRepository accountRepository) {
    super(accountRepository);
  }
}
