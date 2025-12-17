package com.example.area.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.viewModel.UserViewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.CustomWhite

@Composable
fun ButtonLoginComponent(
    textFieldEmail: String,
    textFieldPassword: String,
    userViewModel: UserViewModel,
    rememberMe: Boolean,
    onSuccess: () -> Unit = {}
) {
    Button(
        onClick = {
            userViewModel.loginUser(
                email = textFieldEmail,
                password = textFieldPassword,
                rememberMe = rememberMe,
                onSuccess = onSuccess
            )
        },
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 32.dp, vertical = 20.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Accent,
            contentColor = Color.Black
        )
    ) {
        Text(
            text = "Sign in",
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            color = CustomWhite
        )
    }
}