package com.example.area.data.api

import com.example.area.data.models.Register
import com.example.area.data.models.Login
import com.example.area.data.models.AuthResponse
import com.example.area.data.models.ServicesUrl
import com.example.area.data.models.ServicesValue
import com.example.area.data.models.User
import com.example.area.data.models.ActionDetail
import com.example.area.data.models.ActionReactionRequest
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @POST("auth/v1/register")
    suspend fun registerUser(@Body request: Register) : AuthResponse

    @POST("auth/v1/login")
    suspend fun loginUser(@Body request: Login) : AuthResponse

    @GET("users/v1/me")
    suspend fun getUserProfile() : User

    @GET("users/v1/me/authorization-url/{third_party_service}")
    suspend fun getAuthorizationUrl(
        @Path("third_party_service") service: String,
        @Header("x-client-type") clientType: String = "mobile"
    ) : ServicesUrl

    @GET("services/v1/{service}/actions")
    suspend fun getAllServices(@Path("service") service: String) : List<ServicesValue>

    @GET("services/v1/{service}/reactions")
    suspend fun getAllReactions(@Path("service") service: String) : List<ServicesValue>

    @GET("services/v1/{service}/actions/{action}")
    suspend fun getActionDetails(@Path("service") service: String, @Path("action") action: String) : ActionDetail

    @GET("services/v1/{service}/reactions/{reaction}")
    suspend fun getReactionDetails(@Path("service") service: String, @Path("reaction") reaction: String) : ActionDetail

    @POST("actions-reactions/v1")
    suspend fun createActionReaction(@Body request: ActionReactionRequest)
}