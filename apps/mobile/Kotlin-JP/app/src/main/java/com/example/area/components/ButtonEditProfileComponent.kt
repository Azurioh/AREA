package com.example.area.components

import android.widget.Toast
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.viewModel.UserViewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme
import com.example.area.ui.theme.CustomWhite

@Composable
fun ButtonEditProfileComponent(
    textFieldNewName: String,
    userViewModel: UserViewModel,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
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
                    dyslexiaEnabled = user.dyslexiaEnabled,
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
        modifier = modifier.size(height = 50.dp, width = 0.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Accent,
            contentColor = CustomWhite
        )
    ) {
        Text(
            text = "Save",
            fontSize = 18.sp,
            fontFamily = AppTheme.fonts.primary,
            fontWeight = FontWeight.SemiBold
        )
    }
}