package ee.leola.kassa.controllers

import ee.leola.kassa.repository.TransactionRepository
import ee.leola.kassa.repository.UserRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/stat")
class StatisticsController(
    private val transactionRepository: TransactionRepository,
    private val userRepository: UserRepository
) {
    @GetMapping("/{id}")
    fun getStatistics(@PathVariable("id") userId: Long): Map<String, *> {
        val user = userRepository.findById(userId).orElseThrow()
        return mapOf(
            "popularProducts" to transactionRepository.findPopularProductsByUser(user),
            "transactions" to transactionRepository.findByUser(user)
        )
    }
}
