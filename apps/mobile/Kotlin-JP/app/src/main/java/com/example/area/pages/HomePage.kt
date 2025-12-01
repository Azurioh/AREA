package com.example.area.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.R
import com.example.area.components.DisplayCard
import com.example.area.components.LinearGradient
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.viewModel.UserViewModel

@Composable
fun HomePage(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = viewModel()
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(brush = LinearGradient()),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Home page",
            fontFamily = poppinsFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 30.sp,
            color = Color.White,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .padding(top = 32.dp)
                .fillMaxWidth()
        )

        DisplayCard(
            actionServiceImage = R.drawable.youtube,
            reactionServiceImage = R.drawable.youtube,
            title = "Youtube vidéo post",
            description = "Post vidéo on youtube and send a message on discord server.",
            lastExecution = "Last execution: 2h ago",
            executionCount = 42,
            isEnabled = true,
            onToggle = { isChecked ->
                println("Switch toggled: $isChecked")
            },
            onMenuClick = {
                println("Menu clicked")
            }
        )

        DisplayCard(
            actionServiceImage = R.drawable.youtube,
            reactionServiceImage = R.drawable.youtube,
            title = "Youtube vidéo post",
            description = "Post vidéo on youtube and send a message on discord server.",
            lastExecution = "Last execution: 2h ago",
            executionCount = 42,
            isEnabled = true,
            onToggle = { isChecked ->
                println("Switch toggled: $isChecked")
            },
            onMenuClick = {
                println("Menu clicked")
            }
        )
    }
}