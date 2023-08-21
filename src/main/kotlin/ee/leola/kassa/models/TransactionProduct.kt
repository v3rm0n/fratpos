package ee.leola.kassa.models

import jakarta.persistence.Entity
import jakarta.persistence.OneToOne
import java.math.BigDecimal

@Entity
class TransactionProduct(
    val name:  String,
    val price:  BigDecimal = BigDecimal.ZERO,
    val quantity: Int,
    @OneToOne
    val product: Product
) : Model()