package com.example.area.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.data.models.ActionParam
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme

@Composable
fun ActionParamTextField(
    param: ActionParam,
    value: String,
    onValueChange: (String) -> Unit
) {
    Column {
        Text(
            text = param.label,
            fontFamily = AppTheme.fonts.primary,
            fontWeight = FontWeight.Medium,
            fontSize = 14.sp,
            color = AppTheme.colors.textPrimary,
            modifier = Modifier.padding(bottom = 4.dp)
        )

        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = {
                Text(
                    text = param.placeholder,
                    fontFamily = AppTheme.fonts.secondary
                )
            },
            modifier = Modifier.fillMaxWidth(),
            textStyle = TextStyle(
                fontFamily = AppTheme.fonts.secondary,
                fontSize = 16.sp
            ),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Accent,
                unfocusedBorderColor = AppTheme.colors.textPrimary.copy(alpha = 0.5f)
            )
        )
    }
}
