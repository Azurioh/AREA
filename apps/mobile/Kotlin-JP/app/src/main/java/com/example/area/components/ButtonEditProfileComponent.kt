package com.example.area.components

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
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

@Composable
fun ButtonEditProfileComponent(
    textFieldNewName: String,
    textFieldNewEmail: String,
    userViewModel: UserViewModel,
    onDismiss: () -> Unit
) {
    Button(
        onClick = {
            println(">>> Save edit $textFieldNewName - $textFieldNewEmail")
            onDismiss()
        },
        modifier = Modifier
            .padding(horizontal = 32.dp, vertical = 20.dp)
            .size(width = 170.dp, height = 50.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Accent,
            contentColor = Color.Black
        )
    ) {
        Text(
            text = "Save Profile",
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}