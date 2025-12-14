package com.example.area.pages

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.text.toLowerCase
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.R
import com.example.area.components.ConnectionCard
import com.example.area.components.ProfileCard
import com.example.area.components.EditProfileCard
import com.example.area.ui.theme.Background
import com.example.area.ui.theme.CustomBlack
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.viewModel.ServiceViewModel
import com.example.area.viewModel.UserViewModel


private fun getServiceImage(serviceName: String): Int {
    return when (serviceName.lowercase()) {
        "github" -> R.drawable.github_dark
        "discord" -> R.drawable.discord
        else -> R.drawable.github_dark
    }
}
@Composable
fun ProfilePage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = viewModel(),
    serviceViewModel: ServiceViewModel = viewModel()
) {
    val aboutJson by serviceViewModel.aboutJson.collectAsState()
    var isEditing by remember { mutableStateOf(false) }
    val context = LocalContext.current

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(color = Background),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = if (isEditing) "Edit Profile" else "Profile page",
            fontFamily = poppinsFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = CustomBlack,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 32.dp)
                .fillMaxWidth()
        )

        if (isEditing) {
            EditProfileCard(
                userViewModel = userViewModel,
                onDismiss = { isEditing = false }
            )
        } else {
            ProfileCard(
                userViewModel = userViewModel,
                onEditClick = { isEditing = true }
            )
            Text(
                text = "Services",
                fontFamily = poppinsFontFamily,
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                color = CustomBlack,
                textAlign = TextAlign.Start,
                modifier = Modifier
                    .padding(top = 20.dp, start = 32.dp)
                    .fillMaxWidth()
            )
            aboutJson?.server?.services?.forEach { service ->
                ConnectionCard(
                    serviceImage = getServiceImage(service.name),
                    serviceName = service.name.toLowerCase(),
                    isConnected = false,
                    onButtonClick = {
                        serviceViewModel.connectToService(
                            serviceName = service.name.toLowerCase(),
                            onSuccess = { url ->
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                context.startActivity(intent)
                            },
                            onError = { error ->
                                println("Failed to connect to ${service.name}: $error")
                            }
                        )
                    }
                )
            }
        }
    }
}