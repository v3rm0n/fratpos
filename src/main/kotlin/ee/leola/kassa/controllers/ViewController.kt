package ee.leola.kassa.controllers

import ee.leola.kassa.repository.PaytypeRepository
import ee.leola.kassa.repository.ProductRepository
import ee.leola.kassa.repository.TransactionRepository
import ee.leola.kassa.repository.UserRepository
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class ViewController(
    private val userRepository: UserRepository,
    private val productRepository: ProductRepository,
    private val transactionRepository: TransactionRepository,
    private val paytypeRepository: PaytypeRepository,
) {
    @GetMapping("/dialog/{modal}")
    fun modal(
        @PathVariable("modal") modal: String,
    ): String {
        return "dialog/$modal"
    }

    @GetMapping("/posdata")
    @ResponseBody
    fun posData(): Map<String, *> {
        return mapOf(
            "users" to userRepository.findAll(),
            "paytypes" to paytypeRepository.findAll(),
            "products" to productRepository.findAll().sortedBy { it.name },
            "transactions" to transactionRepository.findByInvalidFalse().sortedByDescending { it.created },
        )
    }

    @GetMapping("/admin/{page}")
    fun page(
        @PathVariable("page") page: String,
    ): String {
        return "admin/$page"
    }
}
