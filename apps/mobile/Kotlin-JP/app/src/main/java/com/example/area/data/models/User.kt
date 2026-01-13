package com.example.area.data.models

data class User(
    val name: String,
    val email: String,
    val role: Int,
    val darkModeEnabled: Boolean,
    val dyslexiaEnabled: Boolean,
    val createdAt: String,
    val updatedAt: String
)
