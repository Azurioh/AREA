package com.example.area.pages

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme
import com.example.area.components.ActionCard
import com.example.area.components.AreaCard
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.R
import com.example.area.components.AreaSelectedCard
import com.example.area.components.ActionDetailCard
import com.example.area.viewModel.ServiceViewModel
import com.example.area.data.models.ServicesValue
import com.example.area.data.models.ActionDetail
import com.example.area.data.models.ReturnedValue
import com.example.area.ui.theme.CustomWhite
import com.example.area.utils.getServiceImage


@Composable
fun CreatePage(
    modifier: Modifier = Modifier,
    serviceViewModel: ServiceViewModel = viewModel()
) {
    val context = LocalContext.current
    val aboutJson by serviceViewModel.aboutJson.collectAsState()

    var onAction by remember { mutableStateOf(false) }
    var onReaction by remember { mutableStateOf(false) }
    var actionSelected by remember { mutableStateOf(false) }
    var reactionSelected by remember { mutableStateOf(false) }
    var actionServices by remember { mutableStateOf<List<ServicesValue>>(emptyList()) }
    var reactionServices by remember { mutableStateOf<List<ServicesValue>>(emptyList()) }
    var selectedAction by remember { mutableStateOf<ServicesValue?>(null) }
    var selectedReaction by remember { mutableStateOf<ServicesValue?>(null) }
    var actionDetail by remember { mutableStateOf<ActionDetail?>(null) }
    var showActionDetail by remember { mutableStateOf(false) }
    var reactionDetail by remember { mutableStateOf<ActionDetail?>(null) }
    var showReactionDetail by remember { mutableStateOf(false) }
    var actionParams by remember { mutableStateOf<Map<String, Any>>(emptyMap()) }
    var reactionParams by remember { mutableStateOf<Map<String, Any>>(emptyMap()) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(color = AppTheme.colors.background),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        when {
            showActionDetail && actionDetail != null && selectedAction != null -> {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.Start
                ) {
                    Button(
                        onClick = {
                            showActionDetail = false
                            actionDetail = null
                            onAction = true
                        },
                        modifier = Modifier
                            .padding(start = 25.dp, top = 25.dp)
                            .size(width = 90.dp, height = 28.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Accent,
                            contentColor = CustomWhite
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ArrowBack,
                            contentDescription = "BackArrow",
                            tint = CustomWhite,
                        )
                        Text(
                            text = "Back",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
                ConfigureDetailView(
                    title = "Configure Action",
                    detail = actionDetail!!,
                    serviceImage = getServiceImage(selectedAction!!.service),
                    onValidate = { paramValues ->
                        actionParams = paramValues
                        actionSelected = true
                        showActionDetail = false
                    }
                )
            }
            showReactionDetail && reactionDetail != null && selectedReaction != null -> {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.Start
                ) {
                    Button(
                        onClick = {
                            showReactionDetail = false
                            reactionDetail = null
                            onReaction = true
                        },
                        modifier = Modifier
                            .padding(start = 25.dp, top = 25.dp)
                            .size(width = 90.dp, height = 28.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Accent,
                            contentColor = CustomWhite
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ArrowBack,
                            contentDescription = "BackArrow",
                            tint = CustomWhite,
                        )
                        Text(
                            text = "Back",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
                ConfigureDetailView(
                    title = "Configure Reaction",
                    detail = reactionDetail!!,
                    serviceImage = getServiceImage(selectedReaction!!.service),
                    serviceViewModel = serviceViewModel,
                    selectedAction = selectedAction,
                    onValidate = { paramValues ->
                        reactionParams = paramValues
                        reactionSelected = true
                        showReactionDetail = false
                    }
                )
            }
            onAction -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(bottom = 100.dp)
                ) {
                    val serviceGroups = actionServices.groupBy { it.service }

                    Button(
                        onClick = {onAction = false},
                        modifier = Modifier
                            .padding(start = 25.dp, top = 25.dp)
                            .size(width = 90.dp, height = 28.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Accent,
                            contentColor = CustomWhite
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ArrowBack,
                            contentDescription = "BackArrow",
                            tint = CustomWhite,
                        )
                        Text(
                            text = "Back",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    serviceGroups.forEach { (serviceName) ->
                        ServiceListView(
                            title = "${serviceName.replaceFirstChar { it.uppercase() }} Actions",
                            isAction = true,
                            serviceViewModel = serviceViewModel,
                            onServiceClick = { service ->
                                serviceViewModel.getActionDetails(
                                    service = service.service,
                                    action = service.name,
                                    onSuccess = { details ->
                                        actionDetail = details
                                        selectedAction = service
                                        showActionDetail = true
                                        onAction = false
                                    },
                                    onError = { error ->
                                        if (!error.contains("401") && !error.contains("Unauthorized")) {
                                            Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                                        }
                                    }
                                )
                            }
                        )
                    }
                }
            }
            onReaction -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(bottom = 100.dp)
                ) {
                    val serviceGroups = reactionServices.groupBy { it.service }

                    Button(
                        onClick = {onReaction = false},
                        modifier = Modifier
                            .padding(start = 25.dp, top = 25.dp)
                            .size(width = 90.dp, height = 28.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Accent,
                            contentColor = CustomWhite
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ArrowBack,
                            contentDescription = "BackArrow",
                            tint = CustomWhite,
                        )
                        Text(
                            text = "Back",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    serviceGroups.forEach { (serviceName) ->
                        ServiceListView(
                            title = "${serviceName.replaceFirstChar { it.uppercase() }} Reactions",
                            isAction = false,
                            serviceViewModel = serviceViewModel,
                            onServiceClick = { service ->
                                serviceViewModel.getReactionDetails(
                                    service = service.service,
                                    reaction = service.name,
                                    onSuccess = { details ->
                                        reactionDetail = details
                                        selectedReaction = service
                                        showReactionDetail = true
                                        onReaction = false
                                    },
                                    onError = { error ->
                                        if (!error.contains("401") && !error.contains("Unauthorized")) {
                                            Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                                        }
                                    }
                                )
                            }
                        )
                    }
                }
            }
            else -> {
                MainView(
                    actionSelected = actionSelected,
                    selectedAction = selectedAction,
                    reactionSelected = reactionSelected,
                    selectedReaction = selectedReaction,
                    onActionClick = {
                        val services = aboutJson?.server?.services ?: emptyList()
                        if (services.isEmpty()) {
                            Toast.makeText(context, "No services available", Toast.LENGTH_SHORT).show()
                            return@MainView
                        }

                        val allActions = mutableListOf<ServicesValue>()
                        var loadedCount = 0

                        services.forEach { service ->
                            val serviceName = service.name.lowercase()
                            serviceViewModel.getServices(
                                service = serviceName,
                                onSuccess = { actions ->
                                    allActions.addAll(actions.map { it.copy(service = serviceName) })
                                    loadedCount++
                                    if (loadedCount == services.size) {
                                        actionServices = allActions
                                        onAction = true
                                    }
                                },
                                onError = { error ->
                                    if (!error.contains("401") && !error.contains("Unauthorized")) {
                                        Toast.makeText(context, "${service.name} Error: $error", Toast.LENGTH_SHORT).show()
                                    }
                                    loadedCount++
                                    if (loadedCount == services.size) {
                                        actionServices = allActions
                                        onAction = true
                                    }
                                }
                            )
                        }
                    },
                    onReactionClick = {
                        val services = aboutJson?.server?.services ?: emptyList()
                        if (services.isEmpty()) {
                            Toast.makeText(context, "No services available", Toast.LENGTH_SHORT).show()
                            return@MainView
                        }

                        val allReactions = mutableListOf<ServicesValue>()
                        var loadedCount = 0

                        services.forEach { service ->
                            val serviceName = service.name.lowercase()
                            serviceViewModel.getReactions(
                                service = serviceName,
                                onSuccess = { reactions ->
                                    allReactions.addAll(reactions.map { it.copy(service = serviceName) })
                                    loadedCount++
                                    if (loadedCount == services.size) {
                                        reactionServices = allReactions
                                        onReaction = true
                                    }
                                },
                                onError = { error ->
                                    Toast.makeText(context, "${service.name} Error: $error", Toast.LENGTH_SHORT).show()
                                    loadedCount++
                                    if (loadedCount == services.size) {
                                        reactionServices = allReactions
                                        onReaction = true
                                    }
                                }
                            )
                        }
                    },
                    onActionRemove = {
                        actionSelected = false
                        selectedAction = null
                    },
                    onReactionRemove = {
                        reactionSelected = false
                        selectedReaction = null
                    },
                    onSubmit = {
                        serviceViewModel.createActionReaction(
                            actionService = selectedAction?.service ?: "github",
                            actionName = selectedAction?.name ?: "",
                            actionParams = actionParams,
                            reactionService = selectedReaction?.service ?: "github",
                            reactionName = selectedReaction?.name ?: "",
                            reactionParams = reactionParams,
                            onSuccess = {
                                Toast.makeText(context, "Action-Reaction created successfully!", Toast.LENGTH_SHORT).show()
                                actionSelected = false
                                reactionSelected = false
                                selectedAction = null
                                selectedReaction = null
                                actionParams = emptyMap()
                                reactionParams = emptyMap()
                            },
                            onError = { error ->
                                if (!error.contains("401") && !error.contains("Unauthorized")) {
                                    Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                                }
                            }
                        )
                    }
                )
            }
        }
    }
}

@Composable
private fun ConfigureDetailView(
    title: String,
    detail: ActionDetail,
    serviceImage: String,
    serviceViewModel: ServiceViewModel = viewModel(),
    selectedAction: ServicesValue? = null,
    onValidate: (Map<String, Any>) -> Unit
) {
    var returnedValues by remember { mutableStateOf<List<ReturnedValue>>(emptyList()) }

    LaunchedEffect(selectedAction) {
        if (selectedAction != null && title.contains("Reaction")) {
            serviceViewModel.getActionReturnedValues(
                service = selectedAction.service,
                action = selectedAction.name,
                onSuccess = { values ->
                    returnedValues = values
                },
                onError = { error ->
                    println("Error fetching returned values: $error")
                }
            )
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(bottom = 100.dp)
    ) {
        Text(
            text = title,
            fontFamily = AppTheme.fonts.primary,
            fontWeight = FontWeight.Bold,
            fontSize = 20.sp,
            color = Accent,
            textAlign = TextAlign.Start,
            modifier = Modifier
                .padding(top = 20.dp, start = 32.dp)
                .fillMaxWidth()
        )

        ActionDetailCard(
            actionServiceImage = serviceImage,
            actionDetail = detail,
            returnedValues = returnedValues,
            onValidate = onValidate
        )
    }
}

@Composable
private fun ServiceListView(
    title: String,
    isAction: Boolean,
    serviceViewModel: ServiceViewModel = viewModel(),
    onServiceClick: (ServicesValue) -> Unit
) {
    val aboutJson by serviceViewModel.aboutJson.collectAsState()

    val keyword = if (isAction) " Actions" else " Reactions"
    val serviceName = title.substringBefore(keyword).lowercase()
    val serviceData = aboutJson?.server?.services?.find { it.name.lowercase() == serviceName }

    Text(
        text = title,
        fontFamily = AppTheme.fonts.primary,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        color = Accent,
        textAlign = TextAlign.Start,
        modifier = Modifier
            .padding(top = 20.dp, start = 32.dp)
            .fillMaxWidth()
    )

    if (serviceData != null) {
        val items = if (isAction) serviceData.actions else serviceData.reactions

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items.forEach { item ->
                AreaCard(
                    actionServiceImage = getServiceImage(serviceData.name),
                    description = item.description,
                    onMenuClick = {
                        onServiceClick(
                            ServicesValue(
                                name = item.name,
                                description = item.description,
                                service = serviceData.name.lowercase()
                            )
                        )
                    }
                )
            }
        }
    }
}

@Composable
private fun MainView(
    actionSelected: Boolean,
    selectedAction: ServicesValue?,
    reactionSelected: Boolean,
    selectedReaction: ServicesValue?,
    onActionClick: () -> Unit,
    onReactionClick: () -> Unit,
    onActionRemove: () -> Unit,
    onReactionRemove: () -> Unit,
    onSubmit: () -> Unit
) {
    Text(
        text = "Create page",
        fontFamily = AppTheme.fonts.primary,
        fontWeight = FontWeight.Bold,
        fontSize = 30.sp,
        color = AppTheme.colors.textPrimary,
        textAlign = TextAlign.Center,
        modifier = Modifier
            .padding(top = 32.dp)
            .fillMaxWidth()
    )

    Text(
        text = "Action → Reaction",
        fontFamily = AppTheme.fonts.primary,
        fontWeight = FontWeight.Bold,
        fontSize = 30.sp,
        color = Accent,
        textAlign = TextAlign.Center,
        modifier = Modifier
            .padding(top = 42.dp)
            .fillMaxWidth()
    )

    Text(
        text = "Click on an Action and then define what should happen next.",
        fontSize = 14.sp,
        fontFamily = AppTheme.fonts.secondary,
        fontWeight = FontWeight.Normal,
        color = AppTheme.colors.textPrimary,
        textAlign = TextAlign.Center,
        modifier = Modifier
            .padding(12.dp)
            .fillMaxWidth()
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 34.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        if (actionSelected && selectedAction != null) {
            AreaSelectedCard(
                actionServiceImage = getServiceImage(selectedAction.service),
                title = "Action",
                description = selectedAction.description,
                onMenuClick = onActionRemove
            )
        } else {
            ActionCard("Action", onClick = onActionClick)
        }

        Image(
            painter = painterResource(id = R.drawable.arrow),
            contentDescription = "Arrow Image",
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .width(100.dp)
                .height(100.dp)
        )

        if (reactionSelected && selectedReaction != null) {
            AreaSelectedCard(
                actionServiceImage = getServiceImage(selectedReaction.service),
                title = "Reaction",
                description = selectedReaction.description,
                onMenuClick = onReactionRemove
            )
        } else {
            ActionCard("Reaction", onClick = onReactionClick)
        }

        if (actionSelected && reactionSelected) {
            Button(
                onClick = onSubmit,
                colors = ButtonDefaults.buttonColors(containerColor = Accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 32.dp, vertical = 20.dp)
                    .height(56.dp)
            ) {
                Text(
                    text = "Create Action-Reaction",
                    fontFamily = AppTheme.fonts.primary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
            }
        }
    }
}
