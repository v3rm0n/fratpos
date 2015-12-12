package ee.leola.kassa.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.repository.PaytypeRepository;
import ee.leola.kassa.repository.ProductRepository;
import ee.leola.kassa.repository.TransactionRepository;
import ee.leola.kassa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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

	@RequestMapping(value = "/dialog/{modal}", method = RequestMethod.GET)
	public String modal(@PathVariable("modal") String modal) {
		return "dialog/" + modal;
	}

	@ResponseBody
	@RequestMapping(value = "/posdata", method = RequestMethod.GET)
	public JsonNode getPosData() {
		ObjectNode result = Json.newObject();
		result.set("users", Json.toJson(userRepository.findAll()));
		result.set("products", Json.toJson(productRepository.findAll()));
		result.set("paytypes", Json.toJson(paytypeRepository.findAll()));
		result.set("transactions", Json.toJson(transactionRepository.findByInvalidFalse()));
		return result;
	}

	@RequestMapping(value = "/admin/{page}", method = RequestMethod.GET)
	public String page(@PathVariable("page") String page) {
		return "admin/" + page;
	}
}
