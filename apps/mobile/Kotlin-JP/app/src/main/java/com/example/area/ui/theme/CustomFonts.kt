package com.example.area.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.font.FontFamily

data class CustomFonts(
    val primary: FontFamily,
    val secondary: FontFamily
)

val BasicFonts = CustomFonts(
    primary = poppinsFontFamily,
    secondary = montserratFontFamily
)

val DyslexicFonts = CustomFonts(
    primary = openDyslexicFontFamily,
    secondary = openDyslexicFontFamily
)

val LocalCustomFonts = staticCompositionLocalOf { BasicFonts }

object AppFonts {
    val fonts: CustomFonts
        @Composable
        get() = LocalCustomFonts.current
}
