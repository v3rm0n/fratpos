package info.kaara.fratpos.pos.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.helper.Json;
import info.kaara.fratpos.pos.model.Product;
import info.kaara.fratpos.pos.model.Stocktaking;
import info.kaara.fratpos.pos.model.Transaction;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.pos.repository.ProductRepository;
import info.kaara.fratpos.pos.repository.StocktakingRepository;
import info.kaara.fratpos.pos.repository.TransactionRepository;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping(value = "/stocktaking")
@Slf4j
public class StocktakingController extends RestBaseController<Stocktaking, Long> {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private TransactionRepository transactionRepository;

	@Autowired
	public StocktakingController(StocktakingRepository stocktakingRepository) {
		super(stocktakingRepository);
	}

	@RequestMapping(value = "/csv/{id}", method = RequestMethod.GET, produces = "text/csv")
	public String getCSV(@PathVariable("id") Long id) throws IOException {
		Stocktaking stocktaking = repo.findOne(id);
		StringBuilder template = new StringBuilder("Inventuur\n");
		template.append("Loomise aeg ").append(stocktaking.getFormattedTime()).append("\n\n");

		template.append("Kasutajad\nStaatus,Eesnimi,Perenimi,Õllenimi,Saldo\n");
		stocktaking.getUsers().forEach(user -> {
			template.append(String.format("%s,%s,%s,%s,%s\n",
					user.get("status").asText(),
					user.get("firstName").asText(),
					user.get("lastName").asText(),
					user.get("beerName").asText(),
					user.get("balance").asText()));
		});
		template.append(",,,Summa,").append(stocktaking.getBalancesSum()).append("\n\n");

		template.append("Tehingud\nAeg,Nimi,Summa,Makseviis,Katkestatud\n");
		stocktaking.getTransactions().forEach(transaction -> {
			template.append(String.format("%s,%s,%s,%s,%s\n",
					transaction.get("formattedTime").asText(),
					transaction.get("user").get("label").asText(),
					transaction.get("sum").asText(),
					transaction.get("paytype").asText(),
					transaction.get("invalid").asBoolean() ? "Jah" : "Ei"));
		});
		template.append(",Summa,").append(stocktaking.getTransactionsSum()).append("\n\n");

		template.append("Laoseis\nNimi,Hind,Kogus\n");
		stocktaking.getProducts().forEach(product -> {
			template.append(String.format("%s,%s,%s\n",
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
	public Stocktaking create(Stocktaking s) {
		log.info("Creating stocktaking");
		Stocktaking stocktaking = new Stocktaking();
		List<User> users = userRepository.findByBalanceNot(BigDecimal.ZERO);
		stocktaking.setUsers(Json.toJson(users).toString());

		List<Transaction> transactions = transactionRepository.findAll();
		stocktaking.setTransactions(Json.toJson(transactions).toString());

		List<Product> products = productRepository.findAll();
		stocktaking.setProducts(Json.toJson(products).toString());

		repo.save(stocktaking);

		transactions.forEach(transaction -> transactionRepository.delete(transaction));

		users.forEach(user -> {
			user.setBalance(BigDecimal.ZERO);
			userRepository.save(user);
		});

		return stocktaking;
	}

}
