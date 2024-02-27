package ee.leola.kassa.controllers.rest

import ee.leola.kassa.helpers.LoggerDelegate
import ee.leola.kassa.models.Transaction
import ee.leola.kassa.repository.ProductRepository
import ee.leola.kassa.repository.TransactionRepository
import ee.leola.kassa.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal

@RestController
@RequestMapping("/transaction")
class TransactionController(
    transactionRepository: TransactionRepository,
    private val userRepository: UserRepository,
    private val productRepository: ProductRepository,
) : RestBaseController<Transaction, Long>(transactionRepository) {
    private val logger by LoggerDelegate()

    @PostMapping("/invalid/{id}")
    fun invalidate(
        @PathVariable("id") id: Long,
    ) = invalidateTransaction(id)

    @PostMapping("/invalid/admin/{id}")
    fun invalidateAdmin(
        @PathVariable("id") id: Long,
    ) = invalidateTransaction(id)

    private fun invalidateTransaction(id: Long) {
        val transaction = repo.findById(id).orElseThrow()

        // Increment product quantities
        if (transaction.affectsQuantity()) {
            transaction.products.forEach { product ->
                incrementProductQuantity(product.product.id!!, product.quantity)
            }
        }
        if (transaction.affectsBalance()) {
            val balance = transaction.products.sumOf { it.price * it.quantity.toBigDecimal() }
            // Increment user balance
            changeUserBalance(transaction.user.id!!, balance)
        }
        repo.save(transaction.invalidate())
    }

    @PostMapping("/{id}")
    override fun update(
        @PathVariable id: Long,
        @RequestBody json: Transaction,
    ): ResponseEntity<Transaction> {
        return ResponseEntity(HttpStatus.METHOD_NOT_ALLOWED)
    }

    @PostMapping
    override fun create(
        @RequestBody json: Transaction,
    ): Transaction {
        logger.info("Saving new transaction {}", json)
        // Decrement product quantities and save
        if (json.affectsQuantity()) {
            json.products.forEach { product ->
                incrementProductQuantity(product.product.id!!, -product.quantity)
            }
        }
        if (json.affectsBalance()) {
            val balance = json.products.sumOf { it.price * it.quantity.toBigDecimal() }
            // Decrement user balance
            changeUserBalance(json.user.id!!, -balance)
        }
        repo.save(json)
        return json
    }

    private fun incrementProductQuantity(
        id: Long,
        quantity: Int,
    ) {
        val product = productRepository.findById(id).orElseThrow()
        productRepository.save(product.incrementQuantity(quantity))
    }

    private fun changeUserBalance(
        id: Long,
        balance: BigDecimal,
    ) {
        val user = userRepository.findById(id).orElseThrow()
        userRepository.save(user.incrementBalance(balance))
    }
}
