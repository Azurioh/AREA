package com.example.area

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.data.api.RetrofitInstance
import com.example.area.ui.theme.PocTheme
import com.example.area.viewModel.UserViewModel

class MainActivity : ComponentActivity() {
    private lateinit var userViewModel: UserViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        RetrofitInstance.initialize(applicationContext)
        userViewModel = ViewModelProvider(this)[UserViewModel::class.java]

        enableEdgeToEdge()
        setContent {
            val userProfile by userViewModel.userProfile.collectAsState()
            val darkTheme = userProfile?.darkModeEnabled ?: false
            val dyslexiaMode = userProfile?.dyslexiaEnabled ?: false

            PocTheme(darkTheme = darkTheme, dyslexiaMode = dyslexiaMode) {
                AppNavigation(userViewModel = userViewModel)
            }
        }

        handleOAuthCallback(intent)
    }

    override fun onResume() {
        super.onResume()
        if (RetrofitInstance.getTokenManager().isLoggedIn()) {
            userViewModel.fetchUserProfile()
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleOAuthCallback(intent)
    }

    private fun handleOAuthCallback(intent: Intent?) {
        val data = intent?.data ?: return

        if (data.scheme == "area" && data.host == "oauth" && data.path?.startsWith("/callback") == true) {
            val status = data.getQueryParameter("status")
            val service = data.getQueryParameter("service")
            val code = data.getQueryParameter("code")
            val state = data.getQueryParameter("state")

            if (data.path == "/callback/app" && code != null && state != null) {
                val loginService = service ?: "github"
                userViewModel.loginWithService(
                    service = loginService,
                    code = code,
                    state = state,
                    onSuccess = {
                        Toast.makeText(this, "Logged in with $loginService successfully!", Toast.LENGTH_SHORT).show()
                    },
                    onError = { error ->
                        Toast.makeText(this, "Login error: $error", Toast.LENGTH_LONG).show()
                    }
                )
                return
            }

            when (status) {
                "success" -> {
                    val message = if (service != null) {
                        "$service connected successfully!"
                    } else {
                        "Service connected successfully!"
                    }
                    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
                }
                "error" -> {
                    val error = data.getQueryParameter("error") ?: "Unknown error"
                    Toast.makeText(this, "Error: $error", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
