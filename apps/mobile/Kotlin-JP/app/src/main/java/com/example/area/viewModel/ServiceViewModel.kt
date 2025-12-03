package com.example.area.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import com.example.area.data.api.RetrofitInstance

class ServiceViewModel : ViewModel() {

    fun connectToService(
        serviceName: String,
        onSuccess: (String) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val url = RetrofitInstance.api.getAuthorizationUrl(serviceName)
                onSuccess(url.url)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Erreur inconnue")
            }
        }
    }
}
