package com.example.area.pages

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.components.ConnectionCard
import com.example.area.components.ProfileCard
import com.example.area.components.EditProfileCard
import com.example.area.ui.theme.AppTheme
import com.example.area.viewModel.ServiceViewModel
import com.example.area.viewModel.UserViewModel
import com.example.area.utils.getServiceImage


@Composable
fun ProfilePage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = viewModel(),
    serviceViewModel: ServiceViewModel = viewModel()
) {
    val aboutJson by serviceViewModel.aboutJson.collectAsState()
    var isEditing by remember { mutableStateOf(false) }
    val context = LocalContext.current
    var serviceStatuses by remember { mutableStateOf<Map<String, Boolean>>(emptyMap()) }

    LaunchedEffect(aboutJson) {
        aboutJson?.server?.services?.forEach { service ->
            serviceViewModel.getServiceStatus(
                serviceName = service.name.lowercase(),
                onSuccess = { status ->
                    serviceStatuses = serviceStatuses + (service.name to status.connected)
                }
            )
        }
    }

    Box(
        modifier = modifier.fillMaxSize()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(color = AppTheme.colors.background)
                .verticalScroll(rememberScrollState())
                .padding(bottom = 100.dp),
            verticalArrangement = Arrangement.Top,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Profile page",
                fontFamily = AppTheme.fonts.primary,
                fontWeight = FontWeight.Bold,
                fontSize = 30.sp,
                color = AppTheme.colors.textPrimary,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .padding(top = 32.dp)
                    .fillMaxWidth()
            )

            ProfileCard(
                userViewModel = userViewModel,
                onEditClick = { isEditing = true }
            )
            Text(
                text = "Services",
                fontFamily = AppTheme.fonts.primary,
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                color = AppTheme.colors.textPrimary,
                textAlign = TextAlign.Start,
                modifier = Modifier
                    .padding(top = 20.dp, start = 32.dp)
                    .fillMaxWidth()
            )
            aboutJson?.server?.services?.forEach { service ->
                val isConnected = serviceStatuses[service.name] ?: false
                ConnectionCard(
                    serviceImage = getServiceImage(service.name),
                    serviceName = service.name.capitalize(),
                    isConnected = isConnected,
                    onButtonClick = {
                        serviceViewModel.connectToService(
                            serviceName = service.name.toLowerCase(),
                            onSuccess = { url ->
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                context.startActivity(intent)
                            },
                            onError = {}
                        )
                    }
                )
            }
        }

        if (isEditing) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(color = AppTheme.colors.background.copy(alpha = 0.7f))
            ) {
                EditProfileCard(
                    userViewModel = userViewModel,
                    onDismiss = { isEditing = false }
                )
            }
        }
    }
}