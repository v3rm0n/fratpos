package ee.leola.kassa.models

import jakarta.persistence.Entity
import java.math.BigDecimal

@Entity
class Product(
    var name:  String,
    var price:  BigDecimal = BigDecimal.ZERO,
    var quantity: Int
) : Model() {

    fun incrementQuantity(increment: Int): Product {
        quantity += increment
        return this
    }
}