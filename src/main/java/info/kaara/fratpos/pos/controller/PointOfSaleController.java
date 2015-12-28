package info.kaara.fratpos.pos.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import info.kaara.fratpos.helper.Json;
import info.kaara.fratpos.pos.model.PopularProduct;
import info.kaara.fratpos.pos.model.Product;
import info.kaara.fratpos.pos.model.Transaction;
import info.kaara.fratpos.pos.repository.PaytypeRepository;
import info.kaara.fratpos.pos.repository.ProductRepository;
import info.kaara.fratpos.pos.repository.TransactionRepository;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.Comparator.comparing;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Secured("ROLE_POS_READ")
@RestController
public class PointOfSaleController {

	@Autowired
	private TransactionRepository transactionRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private PaytypeRepository paytypeRepository;

	@ResponseBody
	@RequestMapping(value = "/posdata", method = GET)
	public JsonNode getPosData() {
		ObjectNode result = Json.newObject();
		result.set("users", Json.toJson(userRepository.findAll()));
		List<Product> products = productRepository.findAll();
		products.sort(comparing(Product::getName));
		result.set("products", Json.toJson(products));
		result.set("paytypes", Json.toJson(paytypeRepository.findAll()));
		List<Transaction> transactions = transactionRepository.findByInvalidFalse();
		transactions.sort(comparing(Transaction::getCreated).reversed());
		result.set("transactions", Json.toJson(transactions));
		return result;
	}

	@RequestMapping(value = "/stat/{id}", method = RequestMethod.GET)
	public JsonNode getStatistics(@PathVariable("id") Long userId) {
		User user = userRepository.findOne(userId);
		List<PopularProduct> prod = transactionRepository.findPopularProductsByUser(user);
		List<Transaction> transactions = transactionRepository.findByUser(user);
		ObjectNode object = Json.newObject();
		object.set("popularProducts", Json.toJson(prod));
		object.set("transactions", Json.toJson(transactions));
		return object;
	}
}
