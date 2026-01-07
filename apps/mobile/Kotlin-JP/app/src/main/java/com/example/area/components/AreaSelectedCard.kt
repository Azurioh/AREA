package com.example.area.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.example.area.ui.theme.Accent
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.ui.theme.AppTheme
import coil.compose.AsyncImage

@Composable
fun AreaSelectedCard(
    actionServiceImage: String,
    title: String,
    description: String,
    onMenuClick: () -> Unit
) {
    ElevatedCard(
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
        modifier = Modifier
            .padding(12.dp)
            .size(width = 350.dp, height = 120.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp, start = 12.dp, end = 12.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
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
                        text = title,
                        fontFamily = poppinsFontFamily,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 17.sp,
                        color = Accent,
                        textAlign = TextAlign.Start
                    )
                }

                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Close",
                    tint = AppTheme.colors.textPrimary,
                    modifier = Modifier
                        .size(24.dp)
                        .clickable { onMenuClick() }
                )
            }

            Text(
                text = description,
                fontFamily = montserratFontFamily,
                fontWeight = FontWeight.Medium,
                fontSize = 13.sp,
                color = AppTheme.colors.textPrimary,
                lineHeight = 15.sp,
                textAlign = TextAlign.Start,
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(start = 12.dp, end = 12.dp, bottom = 12.dp)
                    .fillMaxWidth()
            )
        }
    }
}