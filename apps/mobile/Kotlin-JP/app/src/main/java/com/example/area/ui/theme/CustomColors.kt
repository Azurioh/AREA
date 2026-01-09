package com.example.area.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

data class CustomColors(
    val secondary: Color,
    val background: Color,
    val textFieldBackground: Color,
    val textPrimary: Color,
    val textSecondary: Color
)

val LightCustomColors = CustomColors(
    secondary = LightSecondary,
    background = LightBackground,
    textFieldBackground = LightTextFieldBackground,
    textPrimary = CustomBlack,
    textSecondary = CustomBlack
)

val DarkCustomColors = CustomColors(
    secondary = DarkSecondary,
    background = DarkBackground,
    textFieldBackground = DarkTextFieldBackground,
    textPrimary = DarkText,
    textSecondary = DarkText
)

val LocalCustomColors = staticCompositionLocalOf { LightCustomColors }

object AppTheme {
    val colors: CustomColors
        @Composable
        get() = LocalCustomColors.current
}
