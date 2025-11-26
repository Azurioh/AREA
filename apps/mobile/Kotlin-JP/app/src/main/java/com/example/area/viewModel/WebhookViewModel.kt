package com.example.area.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.State
import com.example.area.data.api.RetrofitInstance
import com.example.area.data.models.CreateWebhookRequest
import com.example.area.data.models.Webhook

class WebhookViewModel : ViewModel() {

    private val _webhooks = mutableStateOf<List<Webhook>>(emptyList())
    val webhooks: State<List<Webhook>> = _webhooks

    fun loadWebhooks() {
        viewModelScope.launch {
            try {
                val response = RetrofitInstance.api.getWebhook()
                _webhooks.value = response
            } catch (e: Exception) {
                println(">>> Erreur : $e")
            }
        }
    }

    fun createWebhook(
        githubUrl: String,
        actions: List<String>,
        discordWebhookUrl: String,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {

                val request = CreateWebhookRequest(
                    githubUrl = githubUrl,
                    actions = actions,
                    discordWebhookUrl = discordWebhookUrl
                )

                val response = RetrofitInstance.api.createWebhook(request)

                loadWebhooks()
                onSuccess()
            } catch (e: Exception) {
                println(">>> Erreur : $e")
                onError(e.message ?: "Erreur inconnue")
            }
        }
    }
}