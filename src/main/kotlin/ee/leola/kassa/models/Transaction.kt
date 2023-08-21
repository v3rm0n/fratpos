package ee.leola.kassa.models

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.persistence.*
import java.time.Instant
import java.time.format.DateTimeFormatter

@Entity
class Transaction(
    var invalid: Boolean = false,
    val created: Instant = Instant.now(),
    @ManyToOne
    val user:  User,
    @OneToMany(cascade = [CascadeType.ALL])
    @JoinTable(
        name = "transaction_transaction_product",
        joinColumns = [JoinColumn(name = "transaction_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "transaction_product_id", referencedColumnName = "id")]
    )
    val products: Set<TransactionProduct>,
    @ManyToOne
    private val paytype:  Paytype
) : Model() {
    fun invalidate(): Transaction {
        invalid = true
        return this
    }

    @get:Transient
    val formattedTime get() = DateTimeFormatter.ISO_INSTANT.format(created)

    @get:Transient
    val sum get() = products.sumOf { it.price * it.quantity.toBigDecimal() }

    @get:Transient
    @get:JsonProperty("paytype")
    val paytypeName get() = paytype.name

    fun affectsQuantity() = paytype.affectsQuantity
    fun affectsBalance() = paytype.affectsBalance
}