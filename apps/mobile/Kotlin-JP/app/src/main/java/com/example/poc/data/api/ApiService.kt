package com.example.poc.data.api

import com.example.poc.data.models.CreateWebhookRequest
import com.example.poc.data.models.Webhook
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {
    @GET("webhook/v1")
    suspend fun getWebhook() : List<Webhook>

    @GET("github/v1/repositories")
    suspend fun getRepositories() : List<String>

    @POST("webhook/v1")
    suspend fun createWebhook(@Body request: CreateWebhookRequest) : Webhook
}