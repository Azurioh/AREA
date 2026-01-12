package com.example.area.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.area.viewModel.UserViewModel

import com.example.area.components.RegisterCard
import com.example.area.ui.theme.AppTheme

@Composable
fun RegisterPage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    onNavigateToLogin: () -> Unit = {},
    onNavigateToMain: () -> Unit = {}
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(color = AppTheme.colors.background),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        RegisterCard(
            userViewModel = userViewModel,
            onNavigateToLogin = onNavigateToLogin,
            onNavigateToMain = onNavigateToMain
        )
    }
}
