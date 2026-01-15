package com.example.area.pages

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.components.DisplayCard
import com.example.area.components.DeleteConfirmationDialog
import com.example.area.data.models.ActionReactionDisplay
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme
import com.example.area.viewModel.ServiceViewModel
import com.example.area.utils.getServiceImage


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomePage(
    modifier: Modifier = Modifier,
    serviceViewModel: ServiceViewModel = viewModel()
) {
    val context = LocalContext.current
    val aboutJson by serviceViewModel.aboutJson.collectAsState()

    var actionsReactions by remember { mutableStateOf<List<ActionReactionDisplay>>(emptyList()) }
    var selectedActionService by remember { mutableStateOf("All") }
    var selectedReactionService by remember { mutableStateOf("All") }
    var expandedAction by remember { mutableStateOf(false) }
    var expandedReaction by remember { mutableStateOf(false) }
    var workflowToDelete by remember { mutableStateOf<ActionReactionDisplay?>(null) }

    val services = remember(aboutJson) {
        val servicesList = aboutJson?.server?.services?.map { it.name.capitalize() } ?: emptyList()
        listOf("All") + servicesList
    }

    val filteredActionsReactions = remember(actionsReactions, selectedActionService, selectedReactionService) {
        actionsReactions.filter { actionReaction ->
            val matchAction = selectedActionService == "All" ||
                             actionReaction.action.service.equals(selectedActionService, ignoreCase = true)
            val matchReaction = selectedReactionService == "All" ||
                               actionReaction.reaction.service.equals(selectedReactionService, ignoreCase = true)
            matchAction && matchReaction
        }
    }

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

        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                ExposedDropdownMenuBox(
                    expanded = expandedAction,
                    onExpandedChange = { expandedAction = !expandedAction },
                    modifier = Modifier.weight(1f)
                ) {
                    OutlinedTextField(
                        value = selectedActionService,
                        onValueChange = {},
                        readOnly = true,
                        label = {
                            Text(
                                text = "Action",
                                fontFamily = AppTheme.fonts.secondary,
                                fontSize = 12.sp
                            )
                        },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedAction)
                        },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth(),
                        textStyle = TextStyle(
                            fontFamily = AppTheme.fonts.secondary,
                            fontSize = 14.sp
                        ),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Accent,
                            unfocusedBorderColor = AppTheme.colors.textPrimary.copy(alpha = 0.5f),
                            focusedTextColor = AppTheme.colors.textPrimary,
                            unfocusedTextColor = AppTheme.colors.textPrimary
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )

                    ExposedDropdownMenu(
                        expanded = expandedAction,
                        onDismissRequest = { expandedAction = false }
                    ) {
                        services.forEach { service ->
                            DropdownMenuItem(
                                text = {
                                    Text(
                                        text = service,
                                        fontFamily = AppTheme.fonts.secondary
                                    )
                                },
                                onClick = {
                                    selectedActionService = service
                                    expandedAction = false
                                }
                            )
                        }
                    }
                }

                ExposedDropdownMenuBox(
                    expanded = expandedReaction,
                    onExpandedChange = { expandedReaction = !expandedReaction },
                    modifier = Modifier.weight(1f)
                ) {
                    OutlinedTextField(
                        value = selectedReactionService,
                        onValueChange = {},
                        readOnly = true,
                        label = {
                            Text(
                                text = "Reaction",
                                fontFamily = AppTheme.fonts.secondary,
                                fontSize = 12.sp
                            )
                        },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedReaction)
                        },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth(),
                        textStyle = TextStyle(
                            fontFamily = AppTheme.fonts.secondary,
                            fontSize = 14.sp
                        ),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Accent,
                            unfocusedBorderColor = AppTheme.colors.textPrimary.copy(alpha = 0.5f),
                            focusedTextColor = AppTheme.colors.textPrimary,
                            unfocusedTextColor = AppTheme.colors.textPrimary
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )

                    ExposedDropdownMenu(
                        expanded = expandedReaction,
                        onDismissRequest = { expandedReaction = false }
                    ) {
                        services.forEach { service ->
                            DropdownMenuItem(
                                text = {
                                    Text(
                                        text = service,
                                        fontFamily = AppTheme.fonts.secondary
                                    )
                                },
                                onClick = {
                                    selectedReactionService = service
                                    expandedReaction = false
                                }
                            )
                        }
                    }
                }
            }
        }

        items(
            items = filteredActionsReactions,
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
                onMenuClick = {
                    workflowToDelete = actionReaction
                }
            )
        }
    }

    workflowToDelete?.let { workflow ->
        val title = "${workflow.action.name.replace('_', ' ', ignoreCase = true).capitalize()} → ${workflow.reaction.name.replace('_', ' ', ignoreCase = true).capitalize()}"

        DeleteConfirmationDialog(
            title = title,
            onDismiss = {
                workflowToDelete = null
            },
            onConfirm = {
                val workflowId = workflow.id
                if (workflowId != null) {
                    serviceViewModel.deleteActionReaction(
                        workflowId = workflowId,
                        onSuccess = {
                            actionsReactions = actionsReactions.filter { it.id != workflowId }
                            Toast.makeText(context, "Action-reaction deleted", Toast.LENGTH_SHORT).show()
                            workflowToDelete = null
                        },
                        onError = { error ->
                            if (!error.contains("401") && !error.contains("Unauthorized")) {
                                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                            }
                            workflowToDelete = null
                        }
                    )
                } else {
                    Toast.makeText(context, "Error: Workflow ID is null", Toast.LENGTH_LONG).show()
                    workflowToDelete = null
                }
            }
        )
    }
}