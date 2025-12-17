package com.example.area.data.api

import android.content.Context
import com.example.area.data.auth.TokenManager
import okhttp3.OkHttpClient
import com.example.area.BuildConfig
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitInstance {
    private var tokenManager: TokenManager? = null
    private var onUnauthorizedCallback: (() -> Unit)? = null
    private var hasTriggeredUnauthorized = false

    fun initialize(context: Context) {
        tokenManager = TokenManager(context)
    }

    fun setOnUnauthorizedCallback(callback: () -> Unit) {
        onUnauthorizedCallback = callback
    }

    fun resetUnauthorizedFlag() {
        hasTriggeredUnauthorized = false
    }

    private val okHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor { chain ->
                val originalRequest = chain.request()
                val requestUrl = originalRequest.url.encodedPath

                val isAuthRoute = requestUrl.contains("/auth/v1/login") ||
                                 requestUrl.contains("/auth/v1/register")

                val token = tokenManager?.getToken()

                val newRequest = if (token != null && !isAuthRoute) {
                    originalRequest.newBuilder()
                        .header("Authorization", "Bearer $token")
                        .build()
                } else {
                    originalRequest
                }

                val response = chain.proceed(newRequest)

                if (response.code == 401 && !isAuthRoute && !hasTriggeredUnauthorized) {
                    hasTriggeredUnauthorized = true
                    tokenManager?.clearToken()
                    onUnauthorizedCallback?.invoke()
                }

                response
            }
            .build()
    }

    val api: ApiService by lazy {
        Retrofit.Builder()
            .client(okHttpClient)
            .baseUrl(BuildConfig.API_BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    fun getTokenManager(): TokenManager = tokenManager!!
}