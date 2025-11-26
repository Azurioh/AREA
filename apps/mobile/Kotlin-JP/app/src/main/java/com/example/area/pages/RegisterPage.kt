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
import com.example.area.components.LinearGradient

@Composable
fun RegisterPage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(brush = LinearGradient()),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        RegisterCard(userViewModel = userViewModel)
    }
}
