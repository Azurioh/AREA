package com.example.area.utils
import com.example.area.BuildConfig

fun getInitials(name: String): String {
    return name.trim().take(2).uppercase()
}

fun getServiceImage(serviceName: String): String {
    val service = serviceName.lowercase()
    return BuildConfig.API_BASE_URL+"images/${service}.png"
}