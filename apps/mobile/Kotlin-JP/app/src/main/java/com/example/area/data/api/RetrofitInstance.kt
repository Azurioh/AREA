package com.example.area.data.api

import android.content.Context
import com.example.area.data.auth.TokenManager
import com.example.area.data.models.RefreshTokenRequest
import okhttp3.OkHttpClient
import com.example.area.BuildConfig
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.runBlocking
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitInstance {
    private var tokenManager: TokenManager? = null
    private var currentBaseUrl: String = ""
    private var apiInstance: ApiService? = null

    private val _isUnauthorized = MutableStateFlow(false)
    val isUnauthorized: StateFlow<Boolean> = _isUnauthorized.asStateFlow()

    fun initialize(context: Context) {
        tokenManager = TokenManager(context)
        currentBaseUrl = getBaseUrl()
    }

    fun resetUnauthorizedState() {
        _isUnauthorized.value = false
    }

    private fun getBaseUrl(): String {
        return tokenManager?.getBaseUrl() ?: BuildConfig.API_BASE_URL
    }

    fun updateBaseUrl(newUrl: String) {
        var url = newUrl.trim()
        if (!url.endsWith("/")) {
            url += "/"
        }
        tokenManager?.saveBaseUrl(url)
        currentBaseUrl = url
        apiInstance = null
    }

    fun resetBaseUrl() {
        tokenManager?.clearBaseUrl()
        currentBaseUrl = BuildConfig.API_BASE_URL
        apiInstance = null
    }

    private fun createOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor { chain ->
                val originalRequest = chain.request()
                val requestUrl = originalRequest.url.encodedPath

                val isAuthRoute = requestUrl.contains("/auth/v1/login") ||
                                 requestUrl.contains("/auth/v1/register") ||
                                 requestUrl.contains("/auth/v1/refresh")

                val token = tokenManager?.getToken()
                val newRequest = if (token != null && !isAuthRoute) {
                    originalRequest.newBuilder()
                        .header("Authorization", "Bearer $token")
                        .build()
                } else {
                    originalRequest
                }

                var response = chain.proceed(newRequest)

                if (response.code == 401 && !isAuthRoute) {
                    response.close()

                    val refreshToken = tokenManager?.getRefreshToken()
                    if (refreshToken != null) {
                        val refreshSuccess = runBlocking {
                            try {
                                val refreshApi = Retrofit.Builder()
                                    .baseUrl(currentBaseUrl)
                                    .addConverterFactory(GsonConverterFactory.create())
                                    .build()
                                    .create(ApiService::class.java)

                                val refreshResponse = refreshApi.refreshToken(
                                    RefreshTokenRequest(refreshToken)
                                )

                                tokenManager?.saveToken(refreshResponse.accessToken)
                                refreshResponse.refreshToken?.let {
                                    tokenManager?.saveRefreshToken(it)
                                }

                                true
                            } catch (e: Exception) {
                                tokenManager?.clearToken()
                                false
                            }
                        }

                        if (refreshSuccess) {
                            val newToken = tokenManager?.getToken()
                            val retryRequest = originalRequest.newBuilder()
                                .header("Authorization", "Bearer $newToken")
                                .build()
                            response = chain.proceed(retryRequest)
                        } else {
                            if (!_isUnauthorized.value) {
                                _isUnauthorized.value = true
                            }
                        }
                    } else {
                        tokenManager?.clearToken()
                        if (!_isUnauthorized.value) {
                            _isUnauthorized.value = true
                        }
                    }
                }

                response
            }
            .build()
    }

    val api: ApiService
        get() {
            val newBaseUrl = getBaseUrl()
            if (apiInstance == null || currentBaseUrl != newBaseUrl) {
                currentBaseUrl = newBaseUrl
                apiInstance = Retrofit.Builder()
                    .client(createOkHttpClient())
                    .baseUrl(currentBaseUrl)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()
                    .create(ApiService::class.java)
            }
            return apiInstance!!
        }

    fun getTokenManager(): TokenManager = tokenManager!!
}