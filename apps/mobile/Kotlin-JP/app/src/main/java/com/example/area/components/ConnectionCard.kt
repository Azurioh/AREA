package com.example.area.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.CustomWhite
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.AppTheme
import coil.compose.AsyncImage

@Composable
fun ConnectionCard(
    serviceImage: String,
    serviceName: String,
    isConnected: Boolean,
    onButtonClick: () -> Unit
) {
    ElevatedCard(
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
        modifier = Modifier
            .padding(12.dp)
            .size(width = 350.dp, height = 80.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxSize()
            ) {
                AsyncImage(
                    model = serviceImage,
                    contentDescription = "$serviceName Image",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier
                        .width(100.dp)
                        .height(100.dp)
                        .padding(12.dp)
                        .clip(RoundedCornerShape(10.dp))
                )

                Text(
                    text = serviceName,
                    fontFamily = montserratFontFamily,
                    fontWeight = FontWeight.Medium,
                    fontSize = 15.sp,
                    color = AppTheme.colors.textPrimary,
                    modifier = Modifier.weight(1f)
                )

                Button(
                    onClick = onButtonClick,
                    modifier = Modifier
                        .padding(12.dp)
                        .size(width = 90.dp, height = 28.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isConnected) Color(0xFF5E5E5E) else Accent,
                        contentColor = CustomWhite
                    ),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = if (isConnected) "Connected" else "Connect",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}