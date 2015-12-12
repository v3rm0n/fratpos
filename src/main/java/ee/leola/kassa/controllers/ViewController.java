package ee.leola.kassa.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.repository.PaytypeRepository;
import ee.leola.kassa.repository.ProductRepository;
import ee.leola.kassa.repository.TransactionRepository;
import ee.leola.kassa.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@Slf4j
public class ViewController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private TransactionRepository transactionRepository;

	@Autowired
	private PaytypeRepository paytypeRepository;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public ModelAndView index() {
		return new ModelAndView("index", "title", "Kassa");
	}

	@RequestMapping(value = "/dialog/{modal}", method = RequestMethod.GET)
	public String modal(@PathVariable("modal") String modal) {
		log.debug("Opening modal {}", modal);
		return "dialog/" + modal;
	}

	@ResponseBody
	@RequestMapping(value = "/posdata", method = RequestMethod.GET)
	public JsonNode getPosData() {
		log.debug("Getting POS data");
		ObjectNode result = Json.newObject();
		result.put("users", Json.toJson(userRepository.findAll()));
		result.put("products", Json.toJson(productRepository.findAll()));
		result.put("paytypes", Json.toJson(paytypeRepository.findAll()));
		result.put("transactions", Json.toJson(transactionRepository.findByInvalidFalse()));
		return result;
	}

	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public ModelAndView admin() {
		return new ModelAndView("admin", "title", "Admin");
	}

	@RequestMapping(value = "/admin/{page}", method = RequestMethod.GET)
	public String page(@PathVariable("page") String page) {
		log.debug("Opening admin page {}", page);
		return "admin/" + page;
	}
}
