package com.example.area.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.example.area.ui.theme.Secondary
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.CustomBlack
import com.example.area.ui.theme.montserratFontFamily
import coil.compose.AsyncImage

@Composable
fun AreaCard(
    actionServiceImage: String,
    description: String,
    onMenuClick: () -> Unit
) {
    ElevatedCard(
        onClick = onMenuClick,
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = Secondary),
        modifier = Modifier
            .padding(8.dp)
            .size(width = 350.dp, height = 60.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            Row(
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .padding(top = 6.dp, start = 12.dp)
            ) {
                AsyncImage(
                    model = actionServiceImage,
                    contentDescription = "Service Image",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(10.dp))
                )
                Text(
                    text = description,
                    fontFamily = montserratFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 15.sp,
                    color = CustomBlack,
                    lineHeight = 15.sp,
                    textAlign = TextAlign.Start,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}