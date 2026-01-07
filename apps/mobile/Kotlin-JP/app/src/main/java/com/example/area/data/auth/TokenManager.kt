package com.example.area.data.auth

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class TokenManager(context: Context) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val sharedPreferences: SharedPreferences = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveToken(token: String) {
        sharedPreferences.edit().putString(KEY_TOKEN, token).apply()
    }

    fun getToken(): String? {
        return sharedPreferences.getString(KEY_TOKEN, null)
    }

    fun clearToken() {
        sharedPreferences.edit().remove(KEY_TOKEN).apply()
    }

    fun isLoggedIn(): Boolean {
        return getToken() != null
    }

    fun saveBaseUrl(url: String) {
        sharedPreferences.edit().putString(KEY_BASE_URL, url).apply()
    }

    fun getBaseUrl(): String? {
        return sharedPreferences.getString(KEY_BASE_URL, null)
    }

    fun clearBaseUrl() {
        sharedPreferences.edit().remove(KEY_BASE_URL).apply()
    }

    companion object {
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_BASE_URL = "base_url"
    }
}
