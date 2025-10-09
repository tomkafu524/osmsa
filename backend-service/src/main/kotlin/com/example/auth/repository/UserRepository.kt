package com.example.auth.repository

import org.springframework.data.jpa.repository.JpaRepository
import com.example.auth.model.User
import java.util.Optional

interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
    fun existsByEmail(email: String): Boolean
}
    