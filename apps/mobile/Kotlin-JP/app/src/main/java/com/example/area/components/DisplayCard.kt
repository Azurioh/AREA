package com.example.area.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Dehaze
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.layout.offset
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.CustomWhite
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.poppinsFontFamily
import coil.compose.AsyncImage

@Composable
fun DisplayCard(
    actionServiceImage: String,
    reactionServiceImage: String,
    title: String,
    description: String,
    lastExecution: String,
    executionCount: Int,
    isEnabled: Boolean,
    onToggle: (Boolean) -> Unit,
    onMenuClick: () -> Unit
) {
    ElevatedCard(
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
        modifier = Modifier
            .padding(12.dp)
            .size(width = 350.dp, height = 180.dp)
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

                Icon(
                    imageVector = Icons.Filled.ArrowForward,
                    contentDescription = "Arrow",
                    tint = Accent,
                    modifier = Modifier
                        .size(20.dp)
                        .offset(y = 10.dp)
                )

                AsyncImage(
                    model = reactionServiceImage,
                    contentDescription = "Service Image",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(10.dp))
                )
            }

            Row(
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(top = 0.dp, end = 12.dp)
            ) {
                Switch(
                    checked = isEnabled,
                    onCheckedChange = { onToggle(it) },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.White,
                        checkedTrackColor = Accent,
                        uncheckedThumbColor = Color.White,
                        uncheckedTrackColor = Color(0xFF5E5E5E),
                    ),
                    modifier = Modifier.scale(0.8f)
                )

                Icon(
                    imageVector = Icons.Filled.Dehaze,
                    contentDescription = "Menu",
                    tint = AppTheme.colors.textPrimary,
                    modifier = Modifier
                        .size(20.dp)
                        .offset(y = 13.dp)
                        .clickable { onMenuClick() }
                )
            }

            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = 12.dp, end = 12.dp, top = 0.dp)
            ) {
                Text(
                    text = title,
                    fontFamily = poppinsFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 17.sp,
                    color = Accent,
                    textAlign = TextAlign.Start,
                    modifier = Modifier.fillMaxWidth()
                )

                Text(
                    text = description,
                    fontFamily = montserratFontFamily,
                    fontWeight = FontWeight.Medium,
                    fontSize = 13.sp,
                    color = AppTheme.colors.textPrimary,
                    lineHeight = 15.sp,
                    textAlign = TextAlign.Start,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            Row(
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.End,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(bottom = 14.dp, end = 12.dp)
            ) {
                Text(
                    text = lastExecution,
                    fontFamily = montserratFontFamily,
                    fontWeight = FontWeight.Medium,
                    fontSize = 10.sp,
                    color = AppTheme.colors.textPrimary,
                    textAlign = TextAlign.End,
                )
            }

            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(start = 12.dp, bottom = 12.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(5.dp),
                ) {
                    ElevatedCard(
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        colors = CardDefaults.elevatedCardColors(containerColor = Accent),
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier
                            .size(width = 40.dp, height = 25.dp)
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier.fillMaxSize()
                        ) {
                            Text(
                                text = executionCount.toString(),
                                fontFamily = poppinsFontFamily,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 12.sp,
                                color = CustomWhite,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                    Text(
                        text = "Executions",
                        fontFamily = montserratFontFamily,
                        fontWeight = FontWeight.Medium,
                        fontSize = 10.sp,
                        color = AppTheme.colors.textPrimary,
                        textAlign = TextAlign.End,
                    )
                }
            }
        }
    }
}