package com.example.area.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme
import com.example.area.ui.theme.CustomWhite
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.viewModel.UserViewModel

@Composable
fun SettingsPage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = viewModel(),
    onLogout: () -> Unit = {}
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(color = AppTheme.colors.background),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Settings",
            fontFamily = poppinsFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = AppTheme.colors.textPrimary,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 32.dp)
                .fillMaxWidth()
        )

        Button(
            onClick = onLogout,
            colors = ButtonDefaults.buttonColors(
                containerColor = Accent
            ),
            modifier = Modifier
                .padding(top = 32.dp)
        ) {
            Text(
                text = "Logout",
                color = CustomWhite,
                fontFamily = poppinsFontFamily,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
