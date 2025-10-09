package com.example.auth.model

import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.UUID

@Entity
data class User(
    @Id
    val id: UUID,
    val email: String,
    val password: String,
    val name: String,
    var resetToken: String? = null,
    var resetTokenExpiry: Long? = null
)
    