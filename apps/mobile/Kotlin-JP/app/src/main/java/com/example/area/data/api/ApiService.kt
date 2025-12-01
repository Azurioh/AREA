package com.example.area.data.api

import com.example.area.data.models.CreateWebhookRequest
import com.example.area.data.models.Register
import com.example.area.data.models.Login
import com.example.area.data.models.Webhook
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {
    @POST("register")
    suspend fun registerUser(@Body request: Register) : String

    @POST("login")
    suspend fun loginUser(@Body request: Login) : String
}