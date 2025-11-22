package com.example.poc.data.models

data class Webhook(
    val uuid: String,
    val githubUrl: String,
    val actions: List<String>,
    val discordWebhookUrl: String
)