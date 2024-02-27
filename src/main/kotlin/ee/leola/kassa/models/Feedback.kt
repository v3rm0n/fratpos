package ee.leola.kassa.models

import jakarta.persistence.Entity
import jakarta.persistence.Transient
import jakarta.validation.constraints.NotNull
import java.time.Instant
import java.time.format.DateTimeFormatter

@Entity
class Feedback(
    val content: @NotNull String,
    val created: Instant = Instant.now(),
) : Model() {
    @get:Transient
    val formattedTime get() = DateTimeFormatter.ISO_INSTANT.format(created)
}
