package ee.leola.kassa.controllers.rest

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import ee.leola.kassa.helpers.LoggerDelegate
import ee.leola.kassa.models.Stocktaking
import ee.leola.kassa.repository.ProductRepository
import ee.leola.kassa.repository.StocktakingRepository
import ee.leola.kassa.repository.TransactionRepository
import ee.leola.kassa.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.transaction.support.TransactionTemplate
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal.ZERO

@RestController
@RequestMapping("/stocktaking")
class StocktakingController(
    stocktakingRepository: StocktakingRepository,
    private val userRepository: UserRepository,
    private val productRepository: ProductRepository,
    private val transactionRepository: TransactionRepository,
    private val objectMapper: ObjectMapper,
    private val transactionTemplate: TransactionTemplate,
) : RestBaseController<Stocktaking, Long>(stocktakingRepository) {

    private val logger by LoggerDelegate()

    @GetMapping("/csv/{id}", produces = ["text/csv"])
    fun getCSV(@PathVariable("id") id: Long): String {
        val stocktaking = repo.findById(id).orElseThrow()
        val template = StringBuilder("Inventuur\n")
        template.append("Loomise aeg ").append(stocktaking.formattedTime).append("\n\n")
        template.append("Kasutajad\nStaatus,Eesnimi,Perenimi,Õllenimi,Saldo\n")
        stocktaking.users.forEach { user ->
            template.append(
                String.format(
                    "%s,%s,%s,%s,%s\n",
                    user["status"].asText(),
                    user["firstName"].asText(),
                    user["lastName"].asText(),
                    user["beerName"].asText(),
                    user["balance"].asText()
                )
            )
        }
        template.append(",,,Summa,").append(stocktaking.balancesSum).append("\n\n")
        template.append("Tehingud\nAeg,Nimi,Summa,Makseviis,Katkestatud\n")
        stocktaking.transactions.forEach { transaction ->
            template.append(
                String.format(
                    "%s,%s,%s,%s,%s\n",
                    transaction["formattedTime"].asText(),
                    transaction["user"]["label"].asText(),
                    transaction["sum"].asText(),
                    transaction["paytype"].asText(),
                    if (transaction["invalid"].asBoolean()) "Jah" else "Ei"
                )
            )
        }
        template.append(",Summa,").append(stocktaking.transactionsSum).append("\n\n")
        template.append("Laoseis\nNimi,Hind,Kogus\n")
        stocktaking.products.forEach { product: JsonNode ->
            template.append(
                String.format(
                    "%s,%s,%s\n",
                    product["name"].asText(),
                    product["price"].asText(),
                    product["quantity"].asText()
                )
            )
        }
        template.append(",Kokku,").append(stocktaking.productsQuantity)
        return template.toString()
    }

    @PostMapping("/{id}")
    override fun update(@PathVariable id: Long, @RequestBody json: Stocktaking): ResponseEntity<Stocktaking> {
        return ResponseEntity(HttpStatus.METHOD_NOT_ALLOWED)
    }

    @PostMapping
    override fun create(json: Stocktaking): Stocktaking {
        logger.info("Creating stocktaking")
        val users = userRepository.findByBalanceNot(ZERO)
        val transactions = transactionRepository.findAll()
        val stocktaking = Stocktaking(
            users = objectMapper.valueToTree(users),
            transactions = objectMapper.valueToTree(transactions),
            products = objectMapper.valueToTree(productRepository.findAll())
        )
        transactionTemplate.execute {
            repo.save(stocktaking)
            transactions.forEach { transaction -> transactionRepository.delete(transaction) }
            users.forEach { user ->
                userRepository.save(user.incrementBalance(-user.balance))
            }
        }
        return stocktaking
    }
}