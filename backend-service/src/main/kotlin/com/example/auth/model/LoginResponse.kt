package com.example.auth.model

data class LoginResponse(
    val token: String,
    val userId: String,
    val email: String,
    val name: String
)
    