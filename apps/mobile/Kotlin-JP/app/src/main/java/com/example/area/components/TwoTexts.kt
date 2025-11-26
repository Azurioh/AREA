package com.example.area.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.Accent

@Composable
fun TwoTexts(modifier: Modifier = Modifier) {
    var checked by remember { mutableStateOf(true) }
    val textStyle = androidx.compose.ui.text.TextStyle(
        fontSize = 14.sp,
        fontFamily = montserratFontFamily
    )

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Checkbox(
                checked = checked,
                onCheckedChange = { checked = it }
            )
            Text(
                text = "Remember me",
                style = textStyle.copy(
                    color = Color.White,
                ),
            )
        }

        Text(
            text = "Forgot password",
            style = textStyle.copy(
                textDecoration = TextDecoration.Underline,
                color = Accent
            ),
            modifier = Modifier
                .padding(end = 16.dp)
                .clickable {
                    println("Click forgot password")
                }
        )
    }
}