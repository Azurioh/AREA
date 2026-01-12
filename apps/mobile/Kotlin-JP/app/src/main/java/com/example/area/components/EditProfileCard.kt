package com.example.area.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.CustomWhite
import com.example.area.viewModel.UserViewModel
import androidx.compose.ui.Alignment
import com.example.area.ui.theme.AppTheme

@Composable
fun EditProfileCard(
    userViewModel: UserViewModel,
    onDismiss: () -> Unit
) {
    var textFieldNewName by remember { mutableStateOf("") }
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        ElevatedCard(
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
            colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
            modifier = Modifier
                .padding(12.dp)
                .size(width = 350.dp, height = 320.dp)
        ) {
            Text(
                text = "Edit profile",
                fontFamily = AppTheme.fonts.primary,
                fontWeight = FontWeight.Bold,
                fontSize = 25.sp,
                color = AppTheme.colors.textPrimary,
                textAlign = TextAlign.Start,
                modifier = Modifier
                    .padding(22.dp)
                    .fillMaxWidth()
            )

            LabeledTextField(
                label = "New name",
                value = textFieldNewName,
                onValueChange = { textFieldNewName = it },
                placeholder = "Enter your new name",
                modifier = Modifier.padding(top = 18.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 22.dp, vertical = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(
                    onClick = { onDismiss() },
                    modifier = Modifier
                        .weight(1f)
                        .size(height = 50.dp, width = 0.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF5E5E5E),
                        contentColor = CustomWhite
                    )
                ) {
                    Text(
                        text = "Back",
                        fontSize = 18.sp,
                        fontFamily = AppTheme.fonts.primary,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                ButtonEditProfileComponent(
                    textFieldNewName = textFieldNewName,
                    userViewModel = userViewModel,
                    onDismiss = onDismiss,
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}