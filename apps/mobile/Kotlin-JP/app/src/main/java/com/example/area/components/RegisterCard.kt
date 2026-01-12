package com.example.area.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.viewModel.UserViewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme

data class PasswordCriteria(
    val hasMinLength: Boolean,
    val hasDigit: Boolean,
    val hasSymbol: Boolean
)

fun checkPasswordCriteria(password: String): PasswordCriteria {
    return PasswordCriteria(
        hasMinLength = password.length >= 12,
        hasDigit = password.any { it.isDigit() },
        hasSymbol = password.any { !it.isLetterOrDigit() }
    )
}

fun getPasswordStrength(criteria: PasswordCriteria): Float {
    var strength = 0f
    if (criteria.hasMinLength) strength += 0.33f
    if (criteria.hasDigit) strength += 0.33f
    if (criteria.hasSymbol) strength += 0.34f
    return strength
}

@Composable
fun PasswordStrengthIndicator(password: String) {
    val criteria = checkPasswordCriteria(password)
    val strength = getPasswordStrength(criteria)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 32.dp, vertical = 8.dp)
    ) {
        LinearProgressIndicator(
            progress = { strength },
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp)),
            color = when {
                strength < 0.5f -> Color(0xFFE74C3C)
                strength < 1f -> Color(0xFFF39C12)
                else -> Color(0xFF27AE60)
            },
            trackColor = AppTheme.colors.textPrimary.copy(alpha = 0.1f)
        )

        Spacer(modifier = Modifier.height(12.dp))

        PasswordCriteriaItem(
            text = "At least 12 characters",
            isMet = criteria.hasMinLength
        )
        PasswordCriteriaItem(
            text = "Contains a number",
            isMet = criteria.hasDigit
        )
        PasswordCriteriaItem(
            text = "Contains a symbol",
            isMet = criteria.hasSymbol
        )
    }
}

@Composable
fun PasswordCriteriaItem(text: String, isMet: Boolean) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(vertical = 4.dp)
    ) {
        Icon(
            imageVector = if (isMet) Icons.Filled.CheckCircle else Icons.Filled.RadioButtonUnchecked,
            contentDescription = null,
            tint = if (isMet) Color(0xFF27AE60) else AppTheme.colors.textPrimary.copy(alpha = 0.3f),
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = text,
            fontFamily = AppTheme.fonts.secondary,
            fontWeight = FontWeight.Normal,
            fontSize = 12.sp,
            color = if (isMet) AppTheme.colors.textPrimary else AppTheme.colors.textPrimary.copy(alpha = 0.6f)
        )
    }
}

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
            .size(width = 350.dp, height = 750.dp)
    ) {
        Text(
            text = "Create Account",
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
            text = "Sign up to get started with your profile",
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

        if (textFieldPassword.isNotEmpty()) {
            PasswordStrengthIndicator(password = textFieldPassword)
        }

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
