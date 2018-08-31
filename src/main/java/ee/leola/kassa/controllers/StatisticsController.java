package ee.leola.kassa.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import ee.leola.kassa.helpers.Json;
import ee.leola.kassa.models.PopularProduct;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.models.User;
import ee.leola.kassa.repository.TransactionRepository;
import ee.leola.kassa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/stat")
public class StatisticsController {

    private final TransactionRepository transactionRepository;

    private final UserRepository userRepository;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public JsonNode getStatistics(@PathVariable("id") Long userId) {
        User user = userRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
        List<PopularProduct> prod = transactionRepository.findPopularProductsByUser(user);
        List<Transaction> transactions = transactionRepository.findByUser(user);
        ObjectNode object = Json.newObject();
        object.set("popularProducts", Json.toJson(prod));
        object.set("transactions", Json.toJson(transactions));
        return object;
    }
}
