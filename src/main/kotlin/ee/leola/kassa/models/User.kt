package ee.leola.kassa.models

import jakarta.persistence.Entity
import jakarta.persistence.ManyToOne
import jakarta.persistence.Transient
import java.math.BigDecimal

@Entity
class User(
    var firstName:  String,
    var lastName:  String,
    var beerName: String?,
    @ManyToOne
    var status:  Status,
    var balance: BigDecimal = BigDecimal.ZERO
) : Model() {

    @get:Transient
    val label get() = "${status.name} $firstName $lastName ${if (!beerName.isNullOrEmpty()) " ($beerName)" else ""}"

    fun incrementBalance(increment: BigDecimal): User {
        balance += increment
        return this
    }
}