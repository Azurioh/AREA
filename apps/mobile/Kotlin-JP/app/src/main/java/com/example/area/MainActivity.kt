package com.example.area

import android.os.Bundle
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
                MainScreen()
            }
        }
    }
}
