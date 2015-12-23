package ee.leola.kassa.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.Product;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.repository.PaytypeRepository;
import ee.leola.kassa.repository.ProductRepository;
import ee.leola.kassa.repository.TransactionRepository;
import ee.leola.kassa.user.model.User;
import ee.leola.kassa.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.security.Principal;
import java.util.List;

import static java.util.Comparator.comparing;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class ViewController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private TransactionRepository transactionRepository;

	@Autowired
	private PaytypeRepository paytypeRepository;

	@RequestMapping(value = "/", method = GET)
	public ModelAndView index(Principal principal) {
		User user = null;
		if (principal != null) {
			user = userRepository.findByEmail(principal.getName());
		}
		return new ModelAndView("index", "user", user);
	}

	@RequestMapping(value = "/dialog/{modal}", method = GET)
	public String modal(@PathVariable("modal") String modal) {
		return "dialog/" + modal;
	}

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

	@RequestMapping(value = "/admin/{page}", method = GET)
	public String page(@PathVariable("page") String page) {
		return "admin/" + page;
	}
}
