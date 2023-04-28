package ee.leola.kassa.controllers;

import static java.util.Comparator.comparing;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.Product;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.repository.PaytypeRepository;
import ee.leola.kassa.repository.ProductRepository;
import ee.leola.kassa.repository.TransactionRepository;
import ee.leola.kassa.repository.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ViewController {

  @Autowired private UserRepository userRepository;

  @Autowired private ProductRepository productRepository;

  @Autowired private TransactionRepository transactionRepository;

  @Autowired private PaytypeRepository paytypeRepository;

  @RequestMapping(value = "/dialog/{modal}", method = RequestMethod.GET)
  public String modal(@PathVariable("modal") String modal) {
    return "dialog/" + modal;
  }

  @ResponseBody
  @RequestMapping(value = "/posdata", method = RequestMethod.GET)
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

  @RequestMapping(value = "/admin/{page}", method = RequestMethod.GET)
  public String page(@PathVariable("page") String page) {
    return "admin/" + page;
  }
}
