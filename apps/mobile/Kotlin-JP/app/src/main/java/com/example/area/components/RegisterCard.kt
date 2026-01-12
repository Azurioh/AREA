package com.example.area.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.viewModel.UserViewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme

@Composable
fun RegisterCard(
    userViewModel: UserViewModel,
    onNavigateToLogin: () -> Unit = {},
    onNavigateToMain: () -> Unit = {}
) {
    var textFieldName by remember { mutableStateOf("") }
    var textFieldEmail by remember { mutableStateOf("") }
    var textFieldPassword by remember { mutableStateOf("") }
    var textFieldPassword2 by remember { mutableStateOf("") }
    ElevatedCard(
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
        modifier = Modifier
            .padding(12.dp)
            .size(width = 350.dp, height = 660.dp)
    ) {
        Text(
            text = "Create Account",
            fontFamily = poppinsFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = Accent,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 32.dp)
                .fillMaxWidth()
        )

        Text(
            text = "Sign up to get started with your profile",
            fontSize = 14.sp,
            fontFamily = montserratFontFamily,
            fontWeight = FontWeight.Normal,
            color = AppTheme.colors.textPrimary,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 12.dp)
                .fillMaxWidth()
        )

        LabeledTextField(
            label = "Name",
            value = textFieldName,
            onValueChange = { textFieldName = it },
            placeholder = "Enter your name",
            modifier = Modifier.padding(top = 18.dp)
        )

        LabeledTextField(
            label = "Email",
            value = textFieldEmail,
            onValueChange = { textFieldEmail = it },
            placeholder = "Enter your email",
            modifier = Modifier.padding(top = 18.dp)
        )

        LabeledTextFieldPassword(
            label = "Password",
            value = textFieldPassword,
            onValueChange = { textFieldPassword = it },
            placeholder = "Enter your Password",
            modifier = Modifier.padding(top = 18.dp)
        )

        LabeledTextFieldPassword(
            label = "Confirm Password",
            value = textFieldPassword2,
            onValueChange = { textFieldPassword2 = it },
            placeholder = "Enter your Password",
            modifier = Modifier.padding(top = 18.dp)
        )

        ButtonRegisterComponent(
            textFieldName = textFieldName,
            textFieldEmail = textFieldEmail,
            textFieldPassword = textFieldPassword,
            textFieldPassword2 = textFieldPassword2,
            userViewModel = userViewModel,
            onSuccess = onNavigateToMain
        )

        MultiColorText(
            text1 = "Already have an account? ",
            text2 = "Sign in",
            color2 = Accent,
            fontSize = 14.sp,
            onText2Click = onNavigateToLogin,
            modifier = Modifier.fillMaxWidth()
        )
    }
}
