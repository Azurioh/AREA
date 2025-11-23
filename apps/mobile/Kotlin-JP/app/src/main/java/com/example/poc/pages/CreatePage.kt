package com.example.poc.pages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.poc.viewModel.RepositoryViewModel
import com.example.poc.viewModel.WebhookViewModel

@Composable
fun CreatePage(
    modifier: Modifier = Modifier,
    repositoryViewModel: RepositoryViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    webhookViewModel: WebhookViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    var selectedRepository by remember { mutableStateOf("") }
    var isChecked1 by remember { mutableStateOf(false) }
    var isChecked2 by remember { mutableStateOf(false) }
    var textFieldValue by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        repositoryViewModel.loadRepositories()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF1976D2)),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Create Page",
            fontSize = 40.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White,
            modifier = Modifier.padding(top = 32.dp, bottom = 24.dp)
        )

        RepositoryDropdown(
            repositories = repositoryViewModel.repositories.value,
            selectedRepository = selectedRepository,
            onRepositorySelected = { repo ->
                selectedRepository = repo
            },
            modifier = Modifier.padding(horizontal = 32.dp)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = isChecked1,
                onCheckedChange = { isChecked1 = it },
                colors = CheckboxDefaults.colors(
                    checkedColor = Color.White,
                    uncheckedColor = Color.White,
                )
            )
            Text(
                text = "Push",
                color = Color.White,
                fontSize = 16.sp,
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp, vertical = 0.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = isChecked2,
                onCheckedChange = { isChecked2 = it },
                colors = CheckboxDefaults.colors(
                    checkedColor = Color.White,
                    uncheckedColor = Color.White,
                )
            )
            Text(
                text = "Pull Request",
                color = Color.White,
                fontSize = 16.sp,
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        @OptIn(ExperimentalMaterial3Api::class)
        OutlinedTextField(
            value = textFieldValue,
            onValueChange = { textFieldValue = it },
            label = { Text("Type your URL ...") },
            placeholder = { Text("Type your URL ...") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp, vertical = 16.dp),
            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedTextColor = Color.Black,
                unfocusedTextColor = Color.Black,
                focusedLabelColor = Color.Black,
                unfocusedLabelColor = Color.DarkGray,
                focusedPlaceholderColor = Color.Gray,
                unfocusedPlaceholderColor = Color.Gray
            )
        )
        
        Button(
            onClick = {
                val actions = mutableListOf<String>()
                if (isChecked1) actions.add("push")
                if (isChecked2) actions.add("pull_request")

                webhookViewModel.createWebhook(
                    githubUrl = selectedRepository,
                    actions = actions,
                    discordWebhookUrl = textFieldValue,
                    onSuccess = {
                        selectedRepository = ""
                        isChecked1 = false
                        isChecked2 = false
                        textFieldValue = ""
                    },
                    onError = { error ->
                        println(">>> Erreur lors de la création : $error")
                    }
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp, vertical = 16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.White,
                contentColor = Color(0xFF1976D2)
            )
        ) {
            Text(
                text = "Create",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RepositoryDropdown(
    repositories: List<String>,
    selectedRepository: String,
    onRepositorySelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded },
        modifier = modifier.fillMaxWidth()
    ) {
        OutlinedTextField(
            value = selectedRepository,
            onValueChange = {},
            readOnly = true,
            label = { Text("Select a repository") },
            trailingIcon = {
                ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
            },
            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                focusedTextColor = Color.Black,
                unfocusedTextColor = Color.Black
            ),
            modifier = Modifier
                .menuAnchor()
                .fillMaxWidth()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            if (repositories.isEmpty()) {
                DropdownMenuItem(
                    text = { Text("Loading...") },
                    onClick = {},
                    enabled = false
                )
            } else {
                repositories.forEach { repo ->
                    DropdownMenuItem(
                        text = { Text(repo) },
                        onClick = {
                            onRepositorySelected(repo)
                            expanded = false
                        }
                    )
                }
            }
        }
    }
}