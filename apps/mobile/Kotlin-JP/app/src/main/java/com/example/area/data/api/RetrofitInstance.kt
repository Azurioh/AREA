package com.example.area.data.api

<<<<<<< Updated upstream
import android.content.Context
import com.example.area.data.auth.TokenManager
import okhttp3.OkHttpClient
=======
import com.example.area.BuildConfig
>>>>>>> Stashed changes
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitInstance {
    private var tokenManager: TokenManager? = null

    fun initialize(context: Context) {
        tokenManager = TokenManager(context)
    }

    private val okHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor { chain ->
                val originalRequest = chain.request()
                val token = tokenManager?.getToken()

                val newRequest = if (token != null) {
                    originalRequest.newBuilder()
                        .header("Authorization", "Bearer $token")
                        .build()
                } else {
                    originalRequest
                }

                chain.proceed(newRequest)
            }
            .build()
    }

    val api: ApiService by lazy {
        Retrofit.Builder()
<<<<<<< Updated upstream
            .baseUrl("http://167.86.110.198:8085/")
            .client(okHttpClient)
=======
            .baseUrl(BuildConfig.API_BASE_URL)
>>>>>>> Stashed changes
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    fun getTokenManager(): TokenManager = tokenManager!!
}