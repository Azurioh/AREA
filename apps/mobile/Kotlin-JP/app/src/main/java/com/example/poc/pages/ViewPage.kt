package com.example.poc.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.poc.data.models.Webhook
import com.example.poc.viewModel.WebhookViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun ViewPage(
    modifier: Modifier = Modifier,
    viewModel: WebhookViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
) {
    val webhooks = viewModel.webhooks.value

    LaunchedEffect(Unit) {
        viewModel.loadWebhooks()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF1976D2)),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Text(
            text = "View Page",
            fontSize = 40.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White,
            modifier = Modifier.padding(top = 32.dp)
        )

        if (webhooks.isEmpty()) {
            Text("Loading ...", color = Color.White, modifier = Modifier.padding(16.dp))
        } else {
            webhooks.forEach { webhook ->
                WebhookCard(webhook)
            }
        }
    }
}

@Composable
fun WebhookCard(webhook: Webhook) {
    ElevatedCard(
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        modifier = Modifier
            .padding(12.dp)
            .size(width = 300.dp, height = 220.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("UUID : ${webhook.uuid}", fontWeight = FontWeight.Bold)
            Text("GitHub : ${webhook.githubUrl}")
            Text("Discord : ${webhook.discordWebhookUrl}")
            Text("Actions : ${webhook.actions.joinToString()}")
        }
    }
}