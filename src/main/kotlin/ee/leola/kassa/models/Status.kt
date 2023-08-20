package ee.leola.kassa.models

import jakarta.persistence.Entity

@Entity
class Status(var name: String) : Model()