package ee.leola.kassa.controllers.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.leola.kassa.models.Product;
import ee.leola.kassa.models.Stocktaking;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.models.User;
import ee.leola.kassa.repository.ProductRepository;
import ee.leola.kassa.repository.StocktakingRepository;
import ee.leola.kassa.repository.TransactionRepository;
import ee.leola.kassa.repository.UserRepository;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping(value = "/stocktaking")
@Slf4j
public class StocktakingController extends RestBaseController<Stocktaking, Long> {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final TransactionRepository transactionRepository;

    private final ObjectMapper objectMapper;

    @Autowired
    public StocktakingController(StocktakingRepository stocktakingRepository,
                                 UserRepository userRepository,
                                 ProductRepository productRepository,
                                 TransactionRepository transactionRepository, ObjectMapper objectMapper) {
        super(stocktakingRepository);
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
        this.objectMapper = objectMapper;
    }

    @RequestMapping(value = "/csv/{id}", method = RequestMethod.GET, produces = "text/csv")
    public String getCSV(@PathVariable("id") Long id) {
        Stocktaking stocktaking = repo.findById(id).orElseThrow(IllegalArgumentException::new);
        StringBuilder template = new StringBuilder("Inventuur\n");
        template.append("Loomise aeg ").append(stocktaking.getFormattedTime()).append("\n\n");

        template.append("Kasutajad\nStaatus,Eesnimi,Perenimi,Õllenimi,Saldo\n");
        stocktaking
                .getUsers()
                .forEach(
                        user -> {
                            template.append(
                                    String.format(
                                            "%s,%s,%s,%s,%s\n",
                                            user.get("status").asText(),
                                            user.get("firstName").asText(),
                                            user.get("lastName").asText(),
                                            user.get("beerName").asText(),
                                            user.get("balance").asText()));
                        });
        template.append(",,,Summa,").append(stocktaking.getBalancesSum()).append("\n\n");

        template.append("Tehingud\nAeg,Nimi,Summa,Makseviis,Katkestatud\n");
        stocktaking
                .getTransactions()
                .forEach(
                        transaction -> {
                            template.append(
                                    String.format(
                                            "%s,%s,%s,%s,%s\n",
                                            transaction.get("formattedTime").asText(),
                                            transaction.get("user").get("label").asText(),
                                            transaction.get("sum").asText(),
                                            transaction.get("paytype").asText(),
                                            transaction.get("invalid").asBoolean() ? "Jah" : "Ei"));
                        });
        template.append(",Summa,").append(stocktaking.getTransactionsSum()).append("\n\n");

        template.append("Laoseis\nNimi,Hind,Kogus\n");
        stocktaking
                .getProducts()
                .forEach(
                        product -> {
                            template.append(
                                    String.format(
                                            "%s,%s,%s\n",
                                            product.get("name").asText(),
                                            product.get("price").asText(),
                                            product.get("quantity").asText()));
                        });
        template.append(",Kokku,").append(stocktaking.getProductsQuantity());
        return template.toString();
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.POST)
    public ResponseEntity<Stocktaking> update(@PathVariable Long id, @RequestBody Stocktaking json) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    @SneakyThrows
    public Stocktaking create(Stocktaking s) {
        log.info("Creating stocktaking");
        Stocktaking stocktaking = new Stocktaking();
        List<User> users = userRepository.findByBalanceNot(BigDecimal.ZERO);
        stocktaking.setUsers(objectMapper.valueToTree(users));

        List<Transaction> transactions = transactionRepository.findAll();
        stocktaking.setTransactions(objectMapper.valueToTree(transactions));

        List<Product> products = productRepository.findAll();
        stocktaking.setProducts(objectMapper.valueToTree(products));

        repo.save(stocktaking);

        transactionRepository.deleteAll(transactions);

        users.forEach(
                user -> {
                    user.setBalance(BigDecimal.ZERO);
                    userRepository.save(user);
                });

        return stocktaking;
    }
}
