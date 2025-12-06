package com.example.area.utils

fun getInitials(name: String): String {
    return name.trim().take(2).uppercase()
}
