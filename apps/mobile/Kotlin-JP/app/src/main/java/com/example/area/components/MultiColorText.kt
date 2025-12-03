package com.example.area.components

import androidx.compose.foundation.text.ClickableText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.CustomBlack
import com.example.area.ui.theme.montserratFontFamily

@Composable
fun MultiColorText(
    text1: String,
    color1: Color,
    text2: String,
    color2: Color,
    onText2Click: () -> Unit = {},
    fontSize: TextUnit = 14.sp,
    modifier: Modifier = Modifier
) {
    val annotatedString = buildAnnotatedString {
        withStyle(style = SpanStyle(
            color = CustomBlack,
            fontWeight = FontWeight.Normal
        )) {
            append(text1)
        }

        pushStringAnnotation(tag = "CLICK", annotation = "click")
        withStyle(style = SpanStyle(
            color = color2,
            fontWeight = FontWeight.SemiBold,
            textDecoration = TextDecoration.Underline
        )) {
            append(text2)
        }
        pop()
    }

    ClickableText(
        text = annotatedString,
        onClick = { offset ->
            annotatedString.getStringAnnotations("CLICK", offset, offset)
                .firstOrNull()?.let { onText2Click() }
        },
        style = androidx.compose.ui.text.TextStyle(
            fontSize = fontSize,
            fontFamily = montserratFontFamily,
            textAlign = TextAlign.Center
        ),
        modifier = modifier
    )
}