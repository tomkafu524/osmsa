package com.example.auth.service

import com.example.auth.config.JwtConfig
import com.example.auth.model.LoginRequest
import com.example.auth.model.LoginResponse
import com.example.auth.model.User
import com.example.auth.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtConfig: JwtConfig,
    private val emailService: EmailService
) {

    fun authenticate(loginRequest: LoginRequest): LoginResponse {
        val user = userRepository.findByEmail(loginRequest.email)
            ?: throw IllegalArgumentException("Invalid email or password")
            
        if (!passwordEncoder.matches(loginRequest.password, user.password)) {
            throw IllegalArgumentException("Invalid email or password")
        }
        
        val token = jwtConfig.generateToken(user.email)
        
        return LoginResponse(
            token = token,
            userId = user.id.toString(),
            email = user.email,
            name = user.name
        )
    }

    fun register(loginRequest: LoginRequest): LoginResponse {
        if (userRepository.existsByEmail(loginRequest.email)) {
            throw IllegalArgumentException("Email already in use")
        }
        
        val user = User(
            id = UUID.randomUUID(),
            email = loginRequest.email,
            password = passwordEncoder.encode(loginRequest.password),
            name = extractNameFromEmail(loginRequest.email)
        )
        
        val savedUser = userRepository.save(user)
        val token = jwtConfig.generateToken(savedUser.email)
        
        return LoginResponse(
            token = token,
            userId = savedUser.id.toString(),
            email = savedUser.email,
            name = savedUser.name
        )
    }
    
    fun sendPasswordResetEmail(email: String) {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("User not found with this email")
            
        // 生成重置令牌并发送邮件
        val resetToken = UUID.randomUUID().toString()
        userRepository.updateResetToken(user.id, resetToken)
        
        emailService.sendPasswordResetEmail(
            to = email,
            name = user.name,
            resetLink = "https://yourapp.com/reset-password?token=$resetToken"
        )
    }
    
    private fun extractNameFromEmail(email: String): String {
        return email.substringBefore("@").replace(".", " ").capitalize()
    }
}
    