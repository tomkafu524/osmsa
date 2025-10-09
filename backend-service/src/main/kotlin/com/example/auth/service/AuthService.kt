package com.example.auth.service

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import com.example.auth.model.LoginResponse
import com.example.auth.model.User
import com.example.auth.repository.UserRepository
import com.example.auth.config.JwtUtil

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil
) {

    fun login(email: String, password: String): LoginResponse {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("用户不存在")
        
        if (!passwordEncoder.matches(password, user.password)) {
            throw IllegalArgumentException("密码错误")
        }
        
        val token = jwtUtil.generateToken(email)
        return LoginResponse(token, "登录成功")
    }

    fun register(email: String, password: String): LoginResponse {
        if (userRepository.existsByEmail(email)) {
            throw IllegalArgumentException("邮箱已被注册")
        }
        
        val user = User(
            email = email,
            password = passwordEncoder.encode(password)
        )
        userRepository.save(user)
        
        val token = jwtUtil.generateToken(email)
        return LoginResponse(token, "注册成功")
    }
}
    