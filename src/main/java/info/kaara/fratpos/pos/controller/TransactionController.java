package info.kaara.fratpos.pos.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.pos.model.Product;
import info.kaara.fratpos.pos.model.Transaction;
import info.kaara.fratpos.pos.model.TransactionProduct;
import info.kaara.fratpos.pos.repository.ProductRepository;
import info.kaara.fratpos.pos.repository.TransactionRepository;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping(value = "/transactions")
@Slf4j
public class TransactionController extends RestBaseController<Transaction, Long> {

	private final UserRepository userRepository;

	private final ProductRepository productRepository;

	@Autowired
	public TransactionController(TransactionRepository transactionRepository, UserRepository userRepository, ProductRepository productRepository) {
		super(transactionRepository);
		this.userRepository = userRepository;
		this.productRepository = productRepository;
	}

	@RequestMapping(value = "/{id}/invalid", method = RequestMethod.POST)
	public void invalidate(@PathVariable("id") Long id) {
		invalidateTransaction(id);
	}

	private void invalidateTransaction(Long id) {
		Transaction transaction = repo.findOne(id);

		//Increment product quantities
		if (transaction.getPaytype().isAffectsQuantity()) {
			transaction.getProducts().forEach(product -> incrementProductQuantity(product.getProduct().getId(), product.getQuantity()));
		}

		if (transaction.getPaytype().isAffectsBalance()) {
			BigDecimal balance = transaction.getProducts().stream().map((product -> product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()))))
					.reduce(BigDecimal.ZERO, BigDecimal::add);
			//Increment user balance
			changeUserBalance(transaction.getUser().getId(), balance);
		}

		transaction.setInvalid(true);
		repo.save(transaction);
	}

	@Override
	@RequestMapping(value = "/{id}", method = RequestMethod.POST)
	public ResponseEntity<Transaction> update(@PathVariable Long id, @RequestBody Transaction json, SecurityContextHolderAwareRequestWrapper request) {
		return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
	}

	@Override
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Transaction> create(@RequestBody Transaction transaction, SecurityContextHolderAwareRequestWrapper request) {
		log.info("Saving new transaction {}", transaction);

		//Decrement product quantities and save
		if (transaction.getPaytype().isAffectsQuantity()) {
			transaction.getProducts().forEach(product -> incrementProductQuantity(product.getProduct().getId(), -product.getQuantity()));
		}

		if (transaction.getPaytype().isAffectsBalance()) {
			BigDecimal balance = transaction.getProducts().stream().map((product -> product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()))))
					.reduce(BigDecimal.ZERO, BigDecimal::subtract);
			//Decrement user balance
			changeUserBalance(transaction.getUser().getId(), balance);
		}


		repo.save(transaction);

		return new ResponseEntity<>(transaction, HttpStatus.OK);
	}

	private void incrementProductQuantity(Long id, Integer quantity) {
		Product product = productRepository.findOne(id);
		product.incrementQuantity(quantity);
		productRepository.save(product);
	}

	private void changeUserBalance(Long id, BigDecimal balance) {
		User user = userRepository.findOne(id);
		user.setBalance(user.getBalance().add(balance));
		userRepository.save(user);
	}
}
