package com.example.area.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.TextFieldBackground

@Composable
fun LabeledTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 32.dp)
    ) {
        Text(
            text = label,
            fontSize = 14.sp,
            fontFamily = montserratFontFamily,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            textAlign = TextAlign.Left,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Box(
            modifier = Modifier.fillMaxWidth()
        ) {
            OutlinedTextField(
                value = value,
                onValueChange = onValueChange,
                label = { Text(placeholder) },
                placeholder = { Text(placeholder) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(10.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = TextFieldBackground,
                    unfocusedContainerColor = TextFieldBackground,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedLabelColor = Color.LightGray,
                    unfocusedLabelColor = Color.Gray,
                    focusedPlaceholderColor = Color.Gray,
                    unfocusedPlaceholderColor = Color.Gray,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                )
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                Color.Black.copy(alpha = 0.4f),
                                Color.Transparent
                            ),
                            startY = 0f,
                            endY = 20f
                        ),
                        shape = RoundedCornerShape(10.dp)
                    )
            )
        }
    }
}
