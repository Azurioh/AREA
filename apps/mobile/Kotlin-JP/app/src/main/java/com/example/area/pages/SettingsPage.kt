package com.example.area.pages

import android.R.attr.checked
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.Background
import com.example.area.ui.theme.CustomBlack
import com.example.area.ui.theme.CustomWhite
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.viewModel.UserViewModel

@Composable
fun SettingsPage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = viewModel(),
    onLogout: () -> Unit = {}
) {
    var checked by remember { mutableStateOf(false) }
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(color = Background),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Settings",
            fontFamily = poppinsFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = CustomBlack,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 32.dp)
                .fillMaxWidth()
        )

        Switch(
            checked = checked,
            onCheckedChange = {
                checked = it
            },
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Accent,
                uncheckedThumbColor = Color.White,
                uncheckedTrackColor = Color(0xFF5E5E5E),
            ),
            modifier = Modifier.scale(0.8f)
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
