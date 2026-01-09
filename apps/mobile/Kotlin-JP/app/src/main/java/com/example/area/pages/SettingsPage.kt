package com.example.area.pages

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.BuildConfig
import com.example.area.data.api.RetrofitInstance
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
    val context = LocalContext.current
    var checked by remember { mutableStateOf(false) }
    var baseUrl by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        baseUrl = RetrofitInstance.getTokenManager().getBaseUrl() ?: BuildConfig.API_BASE_URL
    }

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

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp, vertical = 24.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Dark Mode",
                fontFamily = poppinsFontFamily,
                fontWeight = FontWeight.Medium,
                fontSize = 18.sp,
                color = AppTheme.colors.textPrimary
            )

            Switch(
                checked = darkModeEnabled,
                onCheckedChange = { darkModeEnabled = it },
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Color.White,
                    checkedTrackColor = Accent,
                    uncheckedThumbColor = Color.White,
                    uncheckedTrackColor = Color(0xFF5E5E5E)
                )
            )
        }

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

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp, vertical = 16.dp)
        ) {
            Text(
                text = "API Base URL",
                fontFamily = poppinsFontFamily,
                fontWeight = FontWeight.Medium,
                fontSize = 18.sp,
                color = CustomBlack,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            OutlinedTextField(
                value = baseUrl,
                onValueChange = { baseUrl = it },
                placeholder = { Text("Enter base URL") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Accent,
                    unfocusedBorderColor = CustomBlack.copy(alpha = 0.5f)
                ),
                singleLine = true
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = {
                        if (baseUrl.isNotBlank()) {
                            RetrofitInstance.updateBaseUrl(baseUrl)
                            Toast.makeText(context, "Base URL updated successfully", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "URL cannot be empty", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Accent),
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = "Save",
                        color = CustomWhite,
                        fontFamily = poppinsFontFamily,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Button(
                    onClick = {
                        RetrofitInstance.resetBaseUrl()
                        baseUrl = BuildConfig.API_BASE_URL
                        Toast.makeText(context, "Base URL reset to default", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF5E5E5E)),
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = "Reset",
                        color = CustomWhite,
                        fontFamily = poppinsFontFamily,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

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
