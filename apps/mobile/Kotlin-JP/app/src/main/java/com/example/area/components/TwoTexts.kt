package com.example.area.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.AppTheme

@Composable
fun TwoTexts(
    modifier: Modifier = Modifier,
    checked: Boolean = true,
    onCheckedChange: (Boolean) -> Unit = {}
) {
    val textStyle = androidx.compose.ui.text.TextStyle(
        fontSize = 14.sp,
        fontFamily = AppTheme.fonts.secondary
    )

    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Checkbox(
            checked = checked,
            onCheckedChange = onCheckedChange
        )
        Text(
            text = "Remember me",
            style = textStyle.copy(
                color = AppTheme.colors.textPrimary,
            ),
        )
    }
}