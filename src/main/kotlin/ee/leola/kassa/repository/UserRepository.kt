package ee.leola.kassa.repository

import ee.leola.kassa.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.math.BigDecimal

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByBalanceNot(balance: BigDecimal): List<User>
}
