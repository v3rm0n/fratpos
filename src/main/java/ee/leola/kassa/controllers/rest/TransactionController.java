package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.Product;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.models.User;
import ee.leola.kassa.repository.ProductRepository;
import ee.leola.kassa.repository.TransactionRepository;
import ee.leola.kassa.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping(value = "/transaction")
@Slf4j
public class TransactionController extends RestBaseController<Transaction, Long> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    public TransactionController(TransactionRepository transactionRepository) {
        super(transactionRepository);
    }

    @RequestMapping(value = "/invalid/{id}", method = RequestMethod.POST)
    public void invalidate(@PathVariable("id") Long id) {
        invalidateTransaction(id);
    }

    @RequestMapping(value = "/invalid/admin/{id}", method = RequestMethod.POST)
    public void invalidateAdmin(@PathVariable("id") Long id) {
        invalidateTransaction(id);
    }

    private void invalidateTransaction(Long id) {
        Transaction transaction = repo.findById(id).orElseThrow(IllegalArgumentException::new);

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
    public ResponseEntity<Transaction> update(@PathVariable Long id, @RequestBody Transaction json) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    public Transaction create(@RequestBody Transaction transaction) {
        log.info("Saving new transaction {}", transaction);

        //Decrement product quantities and save
        if (transaction.getPaytype().isAffectsQuantity()) {
            transaction.getProducts().stream().forEach(product -> incrementProductQuantity(product.getProduct().getId(), -product.getQuantity()));
        }

        if (transaction.getPaytype().isAffectsBalance()) {
            BigDecimal balance = transaction.getProducts().stream().map((product -> product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()))))
                    .reduce(BigDecimal.ZERO, BigDecimal::subtract);
            //Decrement user balance
            changeUserBalance(transaction.getUser().getId(), balance);
        }


        repo.save(transaction);

        return transaction;
    }

    private void incrementProductQuantity(Long id, Integer quantity) {
        Product product = productRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        product.incrementQuantity(quantity);
        productRepository.save(product);
    }

    private void changeUserBalance(Long id, BigDecimal balance) {
        User user = userRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        user.setBalance(user.getBalance().add(balance));
        userRepository.save(user);
    }
}
