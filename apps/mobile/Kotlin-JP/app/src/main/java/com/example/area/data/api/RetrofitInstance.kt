package com.example.area.data.api

import android.content.Context
import com.example.area.data.auth.TokenManager
import okhttp3.OkHttpClient
import com.example.area.BuildConfig
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitInstance {
    private var tokenManager: TokenManager? = null

    private val _isUnauthorized = MutableStateFlow(false)
    val isUnauthorized: StateFlow<Boolean> = _isUnauthorized.asStateFlow()

    fun initialize(context: Context) {
        tokenManager = TokenManager(context)
    }

    fun resetUnauthorizedState() {
        _isUnauthorized.value = false
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

                if (response.code == 401 && !isAuthRoute && !_isUnauthorized.value) {
                    tokenManager?.clearToken()
                    _isUnauthorized.value = true
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