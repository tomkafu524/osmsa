package com.example.auth.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import com.example.auth.service.AuthService
import com.example.auth.model.LoginRequest
import com.example.auth.model.LoginResponse

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val response = authService.login(request.email, request.password)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/register")
    fun register(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val response = authService.register(request.email, request.password)
        return ResponseEntity.ok(response)
    }
}
    