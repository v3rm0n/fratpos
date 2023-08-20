package ee.leola.kassa.models

import com.fasterxml.jackson.databind.json.JsonMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Entity
import jakarta.persistence.Transient
import org.hibernate.annotations.Type
import java.time.Instant
import java.time.format.DateTimeFormatter

@Entity
class Stocktaking(
    var created: Instant = Instant.now(),

    @Type(JsonType::class)
    var users: ArrayNode = JsonMapper.builder().build().createArrayNode(),

    @Type(JsonType::class)
    var products: ArrayNode = JsonMapper.builder().build().createArrayNode(),

    @Type(JsonType::class)
    var transactions: ArrayNode = JsonMapper.builder().build().createArrayNode()
) : Model() {

    @get:Transient
    val formattedTime get() = DateTimeFormatter.ISO_INSTANT.format(created)

    @get:Transient
    val balancesSum get() = users.sumOf { it.findValue("balance").asDouble().toBigDecimal() }

    @get:Transient
    val transactionsSum
        get() = transactions
            .filter { !it["invalid"].asBoolean() }
            .sumOf { it.findValue("sum").asDouble().toBigDecimal() }

    @get:Transient
    val productsQuantity get() = products.sumOf { it.findValue("quantity").asInt() }

    @get:Transient
    val sums
        get() = transactions
            .filter { it["invalid"].asBoolean() }
            .groupBy { it["paytype"].asText() }
            .map { (k, v) -> k to v.sumOf { it["sum"].asDouble().toBigDecimal() } }
            .toMap()
}
