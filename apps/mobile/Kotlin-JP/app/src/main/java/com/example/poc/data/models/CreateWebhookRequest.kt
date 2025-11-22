package com.example.poc.data.models

data class CreateWebhookRequest(
    val githubUrl: String,
    val actions: List<String>,
    val discordWebhookUrl: String
)
