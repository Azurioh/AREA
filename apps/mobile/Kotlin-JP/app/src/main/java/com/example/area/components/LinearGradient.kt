package com.example.area.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

@Composable
fun LinearGradient(): Brush {
    return Brush.linearGradient(
        colorStops = arrayOf(
            0.0f to Color(0xFF51575C),
            0.2f to Color(0xFF373C41),
            1.0f to Color(0xFF1B1F24)
        ),
        start = Offset.Zero,
        end = Offset.Infinite
    )
}