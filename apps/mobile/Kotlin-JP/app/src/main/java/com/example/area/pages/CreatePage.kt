package com.example.area.pages

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.R
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.Background
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.components.ActionCard
import com.example.area.ui.theme.CustomBlack

@Composable
fun CreatePage(
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(color = Background),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Create page",
            fontFamily = poppinsFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = CustomBlack,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 32.dp)
                .fillMaxWidth()
        )
        Text(
            text = "Action → Reaction",
            fontFamily = poppinsFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = Accent,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 42.dp)
                .fillMaxWidth()
        )
        Text(
            text = "Click on an Action and then define what should happen next.",
            fontSize = 14.sp,
            fontFamily = montserratFontFamily,
            fontWeight = FontWeight.Normal,
            color = CustomBlack,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(12.dp)
                .fillMaxWidth()
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 34.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            ActionCard("Action")
            Image(
                painter = painterResource(id = R.drawable.arrow),
                contentDescription = "Arrow Image",
                contentScale = ContentScale.Fit,
                modifier = Modifier
                    .width(100.dp)
                    .height(100.dp)
            )
            ActionCard("Reaction")
        }
    }
}