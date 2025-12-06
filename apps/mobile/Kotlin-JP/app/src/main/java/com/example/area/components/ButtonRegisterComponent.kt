package com.example.area.components

import android.widget.Toast
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.viewModel.UserViewModel
import com.example.area.ui.theme.Accent

@Composable
fun ButtonRegisterComponent(
    textFieldName: String,
    textFieldEmail: String,
    textFieldPassword: String,
    textFieldPassword2: String,
    userViewModel: UserViewModel,
    onSuccess: () -> Unit = {}
) {
    val context = LocalContext.current
    Button(
        onClick = {
            if (textFieldPassword != textFieldPassword2) {
                Toast.makeText(context, "Passwords don't match", Toast.LENGTH_SHORT).show()
            } else {
                userViewModel.registerUser(
                    name = textFieldName,
                    email = textFieldEmail,
                    password = textFieldPassword,
                    onSuccess = onSuccess
                )
            }
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
            text = "Create Account",
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}
