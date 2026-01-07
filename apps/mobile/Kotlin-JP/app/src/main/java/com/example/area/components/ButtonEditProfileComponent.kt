package com.example.area.components

import android.widget.Toast
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.viewModel.UserViewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.CustomWhite

@Composable
fun ButtonEditProfileComponent(
    textFieldNewName: String,
    userViewModel: UserViewModel,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    val userProfile = userViewModel.userProfile.collectAsState()

    Button(
        onClick = {
            val user = userProfile.value
            if (user != null) {
                userViewModel.updateUser(
                    name = textFieldNewName,
                    darkModeEnabled = user.darkModeEnabled,
                    dyslexiaType = user.dyslexiaType,
                    onSuccess = {
                        Toast.makeText(context, "Profile updated successfully", Toast.LENGTH_SHORT).show()
                        onDismiss()
                    },
                    onError = { error ->
                        Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                    }
                )
            }
        },
        modifier = Modifier
            .padding(horizontal = 32.dp, vertical = 20.dp)
            .size(width = 170.dp, height = 50.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Accent,
            contentColor = CustomWhite
        )
    ) {
        Text(
            text = "Save Profile",
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}