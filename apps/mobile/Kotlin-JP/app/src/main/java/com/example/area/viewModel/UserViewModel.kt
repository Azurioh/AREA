package com.example.area.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import com.example.area.data.api.RetrofitInstance
import com.example.area.data.models.Register
import com.example.area.data.models.Login
import com.example.area.data.models.User
import com.example.area.data.models.UserInfo

class UserViewModel : ViewModel() {

    private val _userProfile = MutableStateFlow<User?>(null)
    val userProfile: StateFlow<User?> = _userProfile.asStateFlow()

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
                    email = email.toLowerCase(),
                    password = password
                )

                val response = RetrofitInstance.api.registerUser(request)
                RetrofitInstance.getTokenManager().saveToken(response.accessToken)
                response.refreshToken?.let {
                    RetrofitInstance.getTokenManager().saveRefreshToken(it)
                }
                RetrofitInstance.resetUnauthorizedState()

                fetchUserProfile()
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun loginUser(
        email: String,
        password: String,
        rememberMe: Boolean = false,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val request = Login(
                    email = email.toLowerCase(),
                    password = password,
                    rememberMe = rememberMe
                )

                val response = RetrofitInstance.api.loginUser(request)
                RetrofitInstance.getTokenManager().saveToken(response.accessToken)
                response.refreshToken?.let {
                    RetrofitInstance.getTokenManager().saveRefreshToken(it)
                }
                RetrofitInstance.resetUnauthorizedState()

                fetchUserProfile()
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun fetchUserProfile(
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val user = RetrofitInstance.api.getUserProfile()
                _userProfile.value = user
            } catch (e: Exception) {
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun updateUser(
        name: String,
        darkModeEnabled: Boolean,
        dyslexiaEnabled: Boolean,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val request = UserInfo(
                    name = name,
                    darkModeEnabled = darkModeEnabled,
                    dyslexiaEnabled = dyslexiaEnabled
                )

                RetrofitInstance.api.updateUserInfo(request)
                fetchUserProfile()
                onSuccess()
            } catch (e: Exception) {
                onError(e.message ?: "Unknown error")
            }
        }
    }
}