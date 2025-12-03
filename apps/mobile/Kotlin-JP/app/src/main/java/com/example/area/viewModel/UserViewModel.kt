package com.example.area.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import com.example.area.data.api.RetrofitInstance
import com.example.area.data.models.Register
import com.example.area.data.models.Login

class UserViewModel : ViewModel() {

    fun registerUser(
        name: String,
        email: String,
        password: String,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {

                val request = Register(
                    name = name,
                    email = email,
                    password = password
                )

                val token = RetrofitInstance.api.registerUser(request)

                RetrofitInstance.getTokenManager().saveToken(token.accessToken)

                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Erreur inconnue")
            }
        }
    }

    fun loginUser(
        email: String,
        password: String,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {

                val request = Login(
                    email = email,
                    password = password
                )

                val token = RetrofitInstance.api.loginUser(request)

                RetrofitInstance.getTokenManager().saveToken(token.accessToken)

                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Erreur inconnue")
            }
        }
    }
}