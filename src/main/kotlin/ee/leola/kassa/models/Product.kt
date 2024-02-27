package ee.leola.kassa.models

import jakarta.persistence.Entity
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal

@Entity
class Product(
    var name: @NotNull String,
    var price: @NotNull BigDecimal = BigDecimal.ZERO,
    var quantity: Int,
) : Model() {
    fun incrementQuantity(increment: Int): Product {
        quantity += increment
        return this
    }
}
