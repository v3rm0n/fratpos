package info.kaara.fratpos.pos.controller;

import info.kaara.fratpos.pos.model.PopularProduct;
import info.kaara.fratpos.pos.model.Transaction;
import info.kaara.fratpos.pos.repository.TransactionRepository;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Secured("ROLE_POS_VIEW")
@RestController
@RequiredArgsConstructor
public class PointOfSaleController {

	private final TransactionRepository transactionRepository;

	private final UserRepository userRepository;

	@RequestMapping(value = "/stat/{id}", method = RequestMethod.GET)
	public Map<String, Object> getStatistics(@PathVariable("id") Long userId) {
		User user = userRepository.findOne(userId);
		List<PopularProduct> prod = transactionRepository.findPopularProductsByUser(user);
		List<Transaction> transactions = transactionRepository.findByUser(user);
		Map<String, Object> result = new HashMap<>();
		result.put("popularProducts", prod);
		result.put("transactions", transactions);
		return result;
	}
}
