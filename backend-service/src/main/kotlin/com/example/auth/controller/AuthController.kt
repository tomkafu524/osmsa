package com.example.auth.controller

import com.example.auth.model.LoginRequest
import com.example.auth.model.LoginResponse
import com.example.auth.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<LoginResponse> {
        val loginResponse = authService.authenticate(loginRequest)
        return ResponseEntity.ok(loginResponse)
    }

    @PostMapping("/register")
    fun register(@RequestBody loginRequest: LoginRequest): ResponseEntity<LoginResponse> {
        val loginResponse = authService.register(loginRequest)
        return ResponseEntity.ok(loginResponse)
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@RequestBody email: Map<String, String>): ResponseEntity<Unit> {
        authService.sendPasswordResetEmail(email["email"] ?: "")
        return ResponseEntity.ok().build()
    }
}
    