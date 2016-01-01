package info.kaara.fratpos.is.controller;

import info.kaara.fratpos.helper.PermissionChecker;
import info.kaara.fratpos.is.model.Income;
import info.kaara.fratpos.is.repository.IncomeRepository;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.experimental.Delegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserIncomeController {

	@Autowired
	private IncomeRepository incomeRepository;

	@Autowired
	private UserRepository userRepository;

	@Delegate
	private PermissionChecker permissionChecker = new PermissionChecker("ROLE_INCOME");

	@ResponseBody
	@RequestMapping("/{id}/incomes")
	public ResponseEntity<Iterable<Income>> listAll(@PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
		if (canRead(request)) {
			User user = userRepository.findOne(id);
			List<Income> userIncomes = incomeRepository.findByUser(user);
			return new ResponseEntity<>(userIncomes, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

}
