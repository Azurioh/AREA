package com.example.area.pages

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import com.example.area.R
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.Background
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.components.ActionCard
import com.example.area.components.AreaCard
import com.example.area.ui.theme.CustomBlack
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.components.AreaSelectedCard
import com.example.area.components.ActionDetailCard
import com.example.area.viewModel.ServiceViewModel
import com.example.area.data.models.ServicesValue
import com.example.area.data.models.ActionDetail

@Composable
fun CreatePage(
    modifier: Modifier = Modifier,
    serviceViewModel: ServiceViewModel = viewModel()
) {
    val context = LocalContext.current
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
            .background(color = Background),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        when {
            showActionDetail && actionDetail != null -> {
                ConfigureDetailView(
                    title = "Configure Action",
                    detail = actionDetail!!,
                    onClose = {
                        showActionDetail = false
                        actionDetail = null
                        selectedAction = null
                    },
                    onValidate = { paramValues ->
                        actionParams = paramValues
                        actionSelected = true
                        showActionDetail = false
                    }
                )
            }
            showReactionDetail && reactionDetail != null -> {
                ConfigureDetailView(
                    title = "Configure Reaction",
                    detail = reactionDetail!!,
                    onClose = {
                        showReactionDetail = false
                        reactionDetail = null
                        selectedReaction = null
                    },
                    onValidate = { paramValues ->
                        reactionParams = paramValues
                        reactionSelected = true
                        showReactionDetail = false
                    }
                )
            }
            onAction -> {
                ServiceListView(
                    title = "Github",
                    services = actionServices,
                    onServiceClick = { service ->
                        serviceViewModel.getActionDetails(
                            service = "github",
                            action = service.name,
                            onSuccess = { details ->
                                actionDetail = details
                                selectedAction = service
                                showActionDetail = true
                                onAction = false
                            },
                            onError = { error ->
                                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                            }
                        )
                    }
                )
            }
            onReaction -> {
                ServiceListView(
                    title = "Github",
                    services = reactionServices,
                    onServiceClick = { service ->
                        serviceViewModel.getReactionDetails(
                            service = "github",
                            reaction = service.name,
                            onSuccess = { details ->
                                reactionDetail = details
                                selectedReaction = service
                                showReactionDetail = true
                                onReaction = false
                            },
                            onError = { error ->
                                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                            }
                        )
                    }
                )
            }
            else -> {
                MainView(
                    actionSelected = actionSelected,
                    selectedAction = selectedAction,
                    reactionSelected = reactionSelected,
                    selectedReaction = selectedReaction,
                    onActionClick = {
                        serviceViewModel.getServices(
                            service = "github",
                            onSuccess = { services ->
                                actionServices = services
                                onAction = true
                            },
                            onError = {}
                        )
                    },
                    onReactionClick = {
                        serviceViewModel.getReactions(
                            service = "github",
                            onSuccess = { reactions ->
                                reactionServices = reactions
                                onReaction = true
                            },
                            onError = {}
                        )
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
                            actionService = "github",
                            actionName = selectedAction?.name ?: "",
                            actionParams = actionParams,
                            reactionService = "github",
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
                                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
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
    onClose: () -> Unit,
    onValidate: (Map<String, Any>) -> Unit
) {
    Text(
        text = title,
        fontFamily = poppinsFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        color = Accent,
        textAlign = TextAlign.Start,
        modifier = Modifier
            .padding(top = 20.dp, start = 32.dp)
            .fillMaxWidth()
    )

    ActionDetailCard(
        actionServiceImage = R.drawable.github_dark,
        actionDetail = detail,
        onClose = onClose,
        onValidate = onValidate
    )
}

@Composable
private fun ServiceListView(
    title: String,
    services: List<ServicesValue>,
    onServiceClick: (ServicesValue) -> Unit
) {
    Text(
        text = title,
        fontFamily = poppinsFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        color = Accent,
        textAlign = TextAlign.Start,
        modifier = Modifier
            .padding(top = 20.dp, start = 32.dp)
            .fillMaxWidth()
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(services) { service ->
            AreaCard(
                actionServiceImage = R.drawable.github_dark,
                description = service.description,
                onMenuClick = { onServiceClick(service) }
            )
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
        fontFamily = poppinsFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 30.sp,
        color = CustomBlack,
        textAlign = TextAlign.Center,
        modifier = Modifier
            .padding(top = 32.dp)
            .fillMaxWidth()
    )

    Text(
        text = "Action → Reaction",
        fontFamily = poppinsFontFamily,
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
        fontFamily = montserratFontFamily,
        fontWeight = FontWeight.Normal,
        color = CustomBlack,
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
                actionServiceImage = R.drawable.github_dark,
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
                actionServiceImage = R.drawable.github_dark,
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
                    fontFamily = poppinsFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
            }
        }
    }
}
