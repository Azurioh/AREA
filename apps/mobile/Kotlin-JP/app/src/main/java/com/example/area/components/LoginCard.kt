package com.example.area.components

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.R
import com.example.area.viewModel.UserViewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme
import com.example.area.ui.theme.CustomWhite

@Composable
fun LoginCard(
    userViewModel: UserViewModel,
    onNavigateToRegister: () -> Unit = {},
    onNavigateToMain: () -> Unit = {}
) {
    val context = LocalContext.current
    var textFieldEmail by remember { mutableStateOf("") }
    var textFieldPassword by remember { mutableStateOf("") }
    var rememberMe by remember { mutableStateOf(false) }
    ElevatedCard(
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight()
            .padding(horizontal = 20.dp, vertical = 12.dp)
    ) {
        Text(
            text = "Welcome Back",
            fontFamily = AppTheme.fonts.primary,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = Accent,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 32.dp)
                .fillMaxWidth()
        )

        Text(
            text = "Sign in to your account to continue",
            fontSize = 14.sp,
            fontFamily = AppTheme.fonts.secondary,
            fontWeight = FontWeight.Normal,
            color = AppTheme.colors.textPrimary,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 12.dp)
                .fillMaxWidth()
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

        TwoTexts(
            modifier = Modifier,
            checked = rememberMe,
            onCheckedChange = { rememberMe = it }
        )

        ButtonLoginComponent(
            textFieldEmail = textFieldEmail,
            textFieldPassword = textFieldPassword,
            userViewModel = userViewModel,
            rememberMe = rememberMe,
            onSuccess = onNavigateToMain
        )

        Text(
            text = "or",
            fontSize = 14.sp,
            fontFamily = AppTheme.fonts.secondary,
            fontWeight = FontWeight.Normal,
            color = AppTheme.colors.textPrimary,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            onClick = {
                userViewModel.getLoginWithGitHubUrl(
                    onSuccess = { url ->
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        context.startActivity(intent)
                    },
                    onError = {}
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp, vertical = 12.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF24292e),
                contentColor = Color.White
            )
        ) {
            Text(
                text = "Sign in with GitHub",
                fontSize = 18.sp,
                fontFamily = AppTheme.fonts.primary,
                fontWeight = FontWeight.SemiBold,
                color = CustomWhite
            )
        }

        MultiColorText(
            text1 = "Don't have an account? ",
            text2 = "Sign up",
            color2 = Accent,
            fontSize = 14.sp,
            onText2Click = onNavigateToRegister,
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 24.dp)
        )
    }
}
