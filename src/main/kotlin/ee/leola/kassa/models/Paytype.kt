package ee.leola.kassa.models

import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany

@Entity
class Paytype(
    var name:  String,
    var affectsBalance: Boolean = false,
    var affectsQuantity: Boolean = false,
    @ManyToMany
    @JoinTable(
        name = "paytype_status",
        joinColumns = [JoinColumn(name = "paytype_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "status_id", referencedColumnName = "id")]
    )
    var allowedForStatus: Set<Status>
) : Model()