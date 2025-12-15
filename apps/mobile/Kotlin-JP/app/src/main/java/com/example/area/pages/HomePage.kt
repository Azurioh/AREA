package com.example.area.pages

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
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
import com.example.area.R
import com.example.area.components.DisplayCard
import com.example.area.data.models.ActionReactionDisplay
import com.example.area.ui.theme.Background
import com.example.area.ui.theme.CustomBlack
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.viewModel.UserViewModel
import com.example.area.viewModel.ServiceViewModel
import com.example.area.data.models.ActionReactionRequest

private fun getServiceImage(service: String): Int {
    return when (service) {
        "github" -> R.drawable.github_dark
        "discord" -> R.drawable.discord
        else -> R.drawable.github_dark
    }
}

@Composable
fun HomePage(
    modifier: Modifier = Modifier,
    serviceViewModel: ServiceViewModel = viewModel()
) {
    val context = LocalContext.current
    var actionsReactions by remember { mutableStateOf<List<ActionReactionDisplay>>(emptyList()) }

    LaunchedEffect(Unit) {
        serviceViewModel.getAllActionsReactions(
            onSuccess = { data ->
                actionsReactions = data
            },
            onError = { error ->
                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
            }
        )
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(color = Background),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        item {
            Text(
                text = "Home page",
                fontFamily = poppinsFontFamily,
                fontWeight = FontWeight.Bold,
                fontSize = 30.sp,
                color = CustomBlack,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .padding(top = 32.dp)
                    .fillMaxWidth()
            )
        }

        items(actionsReactions) { actionReaction ->
            DisplayCard(
                actionServiceImage = getServiceImage(actionReaction.action.service),
                reactionServiceImage = getServiceImage(actionReaction.reaction.service),
                title = "${actionReaction.action.name} → ${actionReaction.reaction.name}",
                description = "Action: ${actionReaction.action.service} | Reaction: ${actionReaction.reaction.service}",
                lastExecution = "Last execution: 0s ago",
                executionCount = actionReaction.numberOfExecution.toInt(),
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
}