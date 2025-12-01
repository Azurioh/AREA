package com.example.area.data.models

data class CreateWebhookRequest(
    val githubUrl: String,
    val actions: List<String>,
    val discordWebhookUrl: String
)
