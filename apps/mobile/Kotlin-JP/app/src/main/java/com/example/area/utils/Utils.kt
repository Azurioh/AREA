package com.example.area.utils

fun getInitials(name: String): String {
    return name.trim().take(2).uppercase()
}

fun getServiceImage(serviceName: String): String {
    val service = serviceName.lowercase()
    return "http://167.86.110.198:8085/images/${service}.png"
}