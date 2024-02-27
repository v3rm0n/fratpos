package ee.leola.kassa.models

import jakarta.persistence.Entity
import jakarta.persistence.OneToOne
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal

@Entity
class TransactionProduct(
    val name: @NotNull String,
    val price: @NotNull BigDecimal = BigDecimal.ZERO,
    val quantity: Int,
    @OneToOne
    val product: Product,
) : Model()
