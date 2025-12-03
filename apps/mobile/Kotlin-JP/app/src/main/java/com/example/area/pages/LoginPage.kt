package com.example.area.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.viewModel.UserViewModel

import com.example.area.components.LoginCard
import com.example.area.ui.theme.Background

@Composable
fun LoginPage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = viewModel(),
    onNavigateToRegister: () -> Unit = {},
    onNavigateToMain: () -> Unit = {}
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(color = Background),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        LoginCard(
            userViewModel = userViewModel,
            onNavigateToRegister = onNavigateToRegister,
            onNavigateToMain = onNavigateToMain
        )
    }
}