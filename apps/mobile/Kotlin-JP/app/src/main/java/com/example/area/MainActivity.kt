package com.example.area

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.area.data.api.RetrofitInstance
import com.example.area.ui.theme.PocTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        RetrofitInstance.initialize(applicationContext)

        enableEdgeToEdge()
        setContent {
            PocTheme {
                AppNavigation()
            }
        }

        handleOAuthCallback(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleOAuthCallback(intent)
    }

    private fun handleOAuthCallback(intent: Intent?) {
        val data = intent?.data
        if (data != null && data.scheme == "area" && data.host == "oauth" && data.path == "/callback") {
            val status = data.getQueryParameter("status")
            val service = data.getQueryParameter("service")

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
