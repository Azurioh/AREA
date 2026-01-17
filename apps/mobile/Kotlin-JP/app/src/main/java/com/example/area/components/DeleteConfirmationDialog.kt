package com.example.area.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme

@Composable
fun DeleteConfirmationDialog(
    title: String,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = AppTheme.colors.secondary),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Confirm Deletion",
                    fontFamily = AppTheme.fonts.primary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = AppTheme.colors.textPrimary
                )

                Text(
                    text = "Do you really want to delete this action-reaction?\n\n\"$title\"",
                    fontFamily = AppTheme.fonts.secondary,
                    fontWeight = FontWeight.Normal,
                    fontSize = 14.sp,
                    color = AppTheme.colors.textPrimary,
                    lineHeight = 20.sp
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(
                        onClick = onDismiss,
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Text(
                            text = "Cancel",
                            fontFamily = AppTheme.fonts.secondary,
                            color = AppTheme.colors.textPrimary
                        )
                    }

                    Button(
                        onClick = onConfirm,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Accent
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "Delete",
                            fontFamily = AppTheme.fonts.secondary,
                            color = AppTheme.colors.secondary
                        )
                    }
                }
            }
        }
    }
}
