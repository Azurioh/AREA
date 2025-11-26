package com.example.area.data.api

import com.example.area.data.models.CreateWebhookRequest
import com.example.area.data.models.Register
import com.example.area.data.models.Login
import com.example.area.data.models.Webhook
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

    @POST("register")
    suspend fun registerUser(@Body request: Register) : String

    @POST("login")
    suspend fun loginUser(@Body request: Login) : String
}