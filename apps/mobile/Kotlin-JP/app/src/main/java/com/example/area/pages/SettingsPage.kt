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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.TextFields
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
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
import com.example.area.viewModel.UserViewModel

@Composable
fun SettingsPage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = viewModel(),
    onLogout: () -> Unit = {}
) {
    val context = LocalContext.current
    val userProfile by userViewModel.userProfile.collectAsState()
    var darkModeEnabled by remember { mutableStateOf(false) }
    var dyslexiaMode by remember { mutableStateOf(false) }
    var baseUrl by remember { mutableStateOf("") }

    LaunchedEffect(userProfile) {
        baseUrl = RetrofitInstance.getTokenManager().getBaseUrl() ?: BuildConfig.API_BASE_URL
        darkModeEnabled = userProfile?.darkModeEnabled ?: false
        dyslexiaMode = (userProfile?.dyslexiaType ?: 0) == 1
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
            fontFamily = AppTheme.fonts.primary,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = AppTheme.colors.textPrimary,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 32.dp, bottom = 24.dp)
                .fillMaxWidth()
        )

        ElevatedCard(
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
            colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.DarkMode,
                        contentDescription = "Dark Mode",
                        tint = Accent,
                        modifier = Modifier.size(28.dp)
                    )
                    Column {
                        Text(
                            text = "Dark Mode",
                            fontFamily = AppTheme.fonts.primary,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 18.sp,
                            color = AppTheme.colors.textPrimary
                        )
                        Text(
                            text = "Toggle dark theme",
                            fontFamily = AppTheme.fonts.primary,
                            fontWeight = FontWeight.Normal,
                            fontSize = 12.sp,
                            color = AppTheme.colors.textPrimary.copy(alpha = 0.6f)
                        )
                    }
                }

                Switch(
                    checked = darkModeEnabled,
                    onCheckedChange = { newValue ->
                        darkModeEnabled = newValue
                        userProfile?.let { profile ->
                            userViewModel.updateUser(
                                name = profile.name,
                                darkModeEnabled = newValue,
                                dyslexiaType = profile.dyslexiaType,
                                onError = { error ->
                                    Toast.makeText(context, "Error updating dark mode: $error", Toast.LENGTH_SHORT).show()
                                }
                            )
                        }
                    },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.White,
                        checkedTrackColor = Accent,
                        uncheckedThumbColor = Color.White,
                        uncheckedTrackColor = Color(0xFF5E5E5E)
                    )
                )
            }
        }

        ElevatedCard(
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
            colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.TextFields,
                        contentDescription = "Dyslexia Mode",
                        tint = Accent,
                        modifier = Modifier.size(28.dp)
                    )
                    Column {
                        Text(
                            text = "Dyslexia Mode",
                            fontFamily = AppTheme.fonts.primary,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 18.sp,
                            color = AppTheme.colors.textPrimary
                        )
                        Text(
                            text = "Use OpenDyslexic font",
                            fontFamily = AppTheme.fonts.primary,
                            fontWeight = FontWeight.Normal,
                            fontSize = 12.sp,
                            color = AppTheme.colors.textPrimary.copy(alpha = 0.6f)
                        )
                    }
                }

                Switch(
                    checked = dyslexiaMode,
                    onCheckedChange = { newValue ->
                        dyslexiaMode = newValue
                        userProfile?.let { profile ->
                            userViewModel.updateUser(
                                name = profile.name,
                                darkModeEnabled = profile.darkModeEnabled,
                                dyslexiaType = if (newValue) 1 else 0,
                                onError = { error ->
                                    Toast.makeText(context, "Error updating dyslexia mode: $error", Toast.LENGTH_SHORT).show()
                                }
                            )
                        }
                    },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.White,
                        checkedTrackColor = Accent,
                        uncheckedThumbColor = Color.White,
                        uncheckedTrackColor = Color(0xFF5E5E5E)
                    )
                )
            }
        }

        ElevatedCard(
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
            colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.padding(bottom = 16.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.Language,
                        contentDescription = "API URL",
                        tint = Accent,
                        modifier = Modifier.size(28.dp)
                    )
                    Column {
                        Text(
                            text = "API Base URL",
                            fontFamily = AppTheme.fonts.primary,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 18.sp,
                            color = AppTheme.colors.textPrimary
                        )
                        Text(
                            text = "Configure server endpoint",
                            fontFamily = AppTheme.fonts.primary,
                            fontWeight = FontWeight.Normal,
                            fontSize = 12.sp,
                            color = AppTheme.colors.textPrimary.copy(alpha = 0.6f)
                        )
                    }
                }

                OutlinedTextField(
                    value = baseUrl,
                    onValueChange = { baseUrl = it },
                    placeholder = {
                        Text(
                            text = "Enter base URL",
                            fontFamily = AppTheme.fonts.secondary
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    textStyle = TextStyle(
                        fontFamily = AppTheme.fonts.secondary,
                        fontSize = 16.sp
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Accent,
                        unfocusedBorderColor = AppTheme.colors.textPrimary.copy(alpha = 0.3f),
                        focusedTextColor = AppTheme.colors.textPrimary,
                        unfocusedTextColor = AppTheme.colors.textPrimary
                    ),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp),
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
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "Save",
                            color = CustomWhite,
                            fontFamily = AppTheme.fonts.primary,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 16.sp
                        )
                    }

                    Button(
                        onClick = {
                            RetrofitInstance.resetBaseUrl()
                            baseUrl = BuildConfig.API_BASE_URL
                            Toast.makeText(context, "Base URL reset to default", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF5E5E5E)),
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "Reset",
                            color = CustomWhite,
                            fontFamily = AppTheme.fonts.primary,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 16.sp
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        ElevatedCard(
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
            colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Button(
                onClick = onLogout,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Accent
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(
                    imageVector = Icons.Filled.Logout,
                    contentDescription = "Logout",
                    tint = CustomWhite,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.size(12.dp))
                Text(
                    text = "Logout",
                    color = CustomWhite,
                    fontFamily = AppTheme.fonts.primary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
            }
        }
    }
}
