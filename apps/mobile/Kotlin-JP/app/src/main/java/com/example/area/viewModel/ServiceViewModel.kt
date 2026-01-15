package com.example.area.viewModel

import android.telephony.ServiceState
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import com.example.area.data.api.RetrofitInstance
import com.example.area.data.models.AboutJson
import com.example.area.data.models.ServicesValue
import com.example.area.data.models.ActionDetail
import com.example.area.data.models.ActionReactionDisplay
import com.example.area.data.models.ActionReactionRequest
import com.example.area.data.models.ActionReactionParams
import com.example.area.data.models.State
import com.example.area.data.models.StateService
import com.example.area.data.models.ReturnedValue
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class ServiceViewModel : ViewModel() {

    private val _aboutJson = MutableStateFlow<AboutJson?>(null)
    val aboutJson: StateFlow<AboutJson?> = _aboutJson.asStateFlow()

    fun connectToService(
        serviceName: String,
        onSuccess: (String) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val url = RetrofitInstance.api.getAuthorizationUrl(serviceName, "mobile")
                onSuccess(url.url)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun getServices(
        service: String,
        onSuccess: (List<ServicesValue>) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val services = RetrofitInstance.api.getAllServices(service)
                onSuccess(services)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun getReactions(
        service: String,
        onSuccess: (List<ServicesValue>) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val reactions = RetrofitInstance.api.getAllReactions(service)
                onSuccess(reactions)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun getActionDetails(
        service: String,
        action: String,
        onSuccess: (ActionDetail) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val actionDetails = RetrofitInstance.api.getActionDetails(service, action)
                onSuccess(actionDetails)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun getReactionDetails(
        service: String,
        reaction: String,
        onSuccess: (ActionDetail) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val reactionDetails = RetrofitInstance.api.getReactionDetails(service, reaction)
                onSuccess(reactionDetails)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun getActionReturnedValues(
        service: String,
        action: String,
        onSuccess: (List<ReturnedValue>) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val returnedValues = RetrofitInstance.api.getActionReturnedValues(service, action)
                onSuccess(returnedValues)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun createActionReaction(
        actionService: String,
        actionName: String,
        actionParams: Map<String, Any>,
        reactionService: String,
        reactionName: String,
        reactionParams: Map<String, Any>,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val request = ActionReactionRequest(
                    action = ActionReactionParams(
                        service = actionService,
                        name = actionName,
                        params = actionParams
                    ),
                    reaction = ActionReactionParams(
                        service = reactionService,
                        name = reactionName,
                        params = reactionParams
                    )
                )
                RetrofitInstance.api.createActionReaction(request)
                onSuccess()
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun getAllActionsReactions(
        onSuccess: (List<ActionReactionDisplay>) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val actionsReactions = RetrofitInstance.api.getAllActionsReactions()
                onSuccess(actionsReactions)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun getAboutJson(
        onSuccess: (AboutJson) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val aboutJson = RetrofitInstance.api.getAboutJson()
                _aboutJson.value = aboutJson
                onSuccess(aboutJson)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun updateStateWorkflow(
        workflowId: String,
        executionState: Boolean,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val stateRequest = State(executionState = executionState)
                RetrofitInstance.api.updateStateWorkflow(workflowId, stateRequest)
                onSuccess()
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun getServiceStatus(
        serviceName: String,
        onSuccess: (StateService) -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                val stateService = RetrofitInstance.api.getStatusService(serviceName)
                onSuccess(stateService)
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }

    fun deleteActionReaction(
        workflowId: String,
        onSuccess: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        viewModelScope.launch {
            try {
                RetrofitInstance.api.deleteActionReaction(workflowId)
                onSuccess()
            } catch (e: Exception) {
                e.printStackTrace()
                onError(e.message ?: "Unknown error")
            }
        }
    }
}
