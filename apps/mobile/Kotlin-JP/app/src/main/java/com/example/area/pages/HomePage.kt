package com.example.area.pages

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
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
import com.example.area.components.DisplayCard
import com.example.area.data.models.ActionReactionDisplay
import com.example.area.ui.theme.AppTheme
import com.example.area.viewModel.ServiceViewModel
import com.example.area.utils.getServiceImage


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
                if (!error.contains("401") && !error.contains("Unauthorized")) {
                    Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                }
            }
        )
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(color = AppTheme.colors.background),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally,
        contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 80.dp)
    ) {
        item {
            Text(
                text = "Home page",
                fontFamily = AppTheme.fonts.primary,
                fontWeight = FontWeight.Bold,
                fontSize = 30.sp,
                color = AppTheme.colors.textPrimary,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .padding(top = 32.dp)
                    .fillMaxWidth()
            )
        }

        items(
            items = actionsReactions,
            key = { actionReaction -> actionReaction.id ?: actionReaction.hashCode() }
        ) { actionReaction ->
            DisplayCard(
                actionServiceImage = getServiceImage(actionReaction.action.service),
                reactionServiceImage = getServiceImage(actionReaction.reaction.service),
                title = "${actionReaction.action.name.replace('_', ' ', ignoreCase = true).capitalize()} → ${actionReaction.reaction.name.replace('_', ' ', ignoreCase = true).capitalize()}",
                description = "Action: ${actionReaction.action.service} | Reaction: ${actionReaction.reaction.service}",
                executionCount = actionReaction.numberOfExecution.toInt(),
                isEnabled = actionReaction.executionState,
                onToggle = { isChecked ->
                    val workflowId = actionReaction.id
                    if (workflowId != null) {
                        actionsReactions = actionsReactions.map { item ->
                            if (item.id == workflowId) {
                                item.copy(executionState = isChecked)
                            } else {
                                item
                            }
                        }

                        serviceViewModel.updateStateWorkflow(
                            workflowId = workflowId,
                            executionState = isChecked,
                            onSuccess = {
                                Toast.makeText(context, "Workflow state updated", Toast.LENGTH_SHORT).show()
                            },
                            onError = { error ->
                                actionsReactions = actionsReactions.map { item ->
                                    if (item.id == workflowId) {
                                        item.copy(executionState = !isChecked)
                                    } else {
                                        item
                                    }
                                }
                                if (!error.contains("401") && !error.contains("Unauthorized")) {
                                    Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                                }
                            }
                        )
                    } else {
                        Toast.makeText(context, "Error: Workflow ID is null", Toast.LENGTH_LONG).show()
                    }
                },
                onMenuClick = {}
            )
        }
    }
}