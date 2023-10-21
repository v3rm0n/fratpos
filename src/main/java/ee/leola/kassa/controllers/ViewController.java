package ee.leola.kassa.controllers;

import ee.leola.kassa.models.Product;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.repository.PaytypeRepository;
import ee.leola.kassa.repository.ProductRepository;
import ee.leola.kassa.repository.TransactionRepository;
import ee.leola.kassa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Comparator.comparing;

@Controller
@RequiredArgsConstructor
public class ViewController {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final TransactionRepository transactionRepository;

    private final PaytypeRepository paytypeRepository;

    @RequestMapping(value = "/dialog/{modal}", method = RequestMethod.GET)
    public String modal(@PathVariable("modal") String modal) {
        return "dialog/" + modal;
    }

    @ResponseBody
    @RequestMapping(value = "/posdata", method = RequestMethod.GET)
    public Map<String, Object> getPosData() {
        Map<String, Object> result = new HashMap<>();
        result.put("users", userRepository.findAll());
        List<Product> products = productRepository.findAll();
        products.sort(comparing(Product::getName));
        result.put("products", products);
        result.put("paytypes", paytypeRepository.findAll());
        List<Transaction> transactions = transactionRepository.findByInvalidFalse();
        transactions.sort(comparing(Transaction::getCreated).reversed());
        result.put("transactions", transactions);
        return result;
    }

    @RequestMapping(value = "/admin/{page}", method = RequestMethod.GET)
    public String page(@PathVariable("page") String page) {
        return "admin/" + page;
    }
}
