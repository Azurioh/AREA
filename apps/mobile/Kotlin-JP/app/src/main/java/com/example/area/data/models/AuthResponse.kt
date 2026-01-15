package com.example.area.data.models

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String? = null
)