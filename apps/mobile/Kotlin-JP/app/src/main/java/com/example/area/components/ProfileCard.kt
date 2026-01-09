package com.example.area.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.viewModel.UserViewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme
import com.example.area.ui.theme.CustomWhite
import com.example.area.utils.getInitials

@Composable
fun ProfileCard(userViewModel: UserViewModel, onEditClick: () -> Unit) {
    val userProfile by userViewModel.userProfile.collectAsState()

    val userName = userProfile?.name ?: "Loading..."
    val userEmail = userProfile?.email ?: "Loading..."

    ElevatedCard(
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
        modifier = Modifier
            .padding(12.dp)
            .size(width = 350.dp, height = 160.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    modifier = Modifier
                        .size(120.dp, 160.dp)
                        .padding(12.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Accent),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = getInitials(userName),
                        fontSize = 40.sp,
                        fontWeight = FontWeight.Bold,
                        color = CustomWhite,
                        fontFamily = poppinsFontFamily
                    )
                }

                Column(
                    verticalArrangement = Arrangement.Top,
                ) {
                    Text(
                        text = userName,
                        fontFamily = poppinsFontFamily,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 20.sp,
                        color = AppTheme.colors.textPrimary,
                        modifier = Modifier
                            .padding(top = 20.dp)
                            .fillMaxWidth()
                    )

                    Text(
                        text = userEmail,
                        fontFamily = poppinsFontFamily,
                        fontWeight = FontWeight.Medium,
                        fontSize = 10.sp,
                        color = AppTheme.colors.textPrimary,
                        modifier = Modifier
                            .padding(top = 10.dp)
                            .fillMaxWidth()
                    )
                }
            }

            Button(
                onClick = onEditClick,
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(12.dp)
                    .size(width = 70.dp, height = 28.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Accent,
                    contentColor = CustomWhite
                ),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "Edit",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
