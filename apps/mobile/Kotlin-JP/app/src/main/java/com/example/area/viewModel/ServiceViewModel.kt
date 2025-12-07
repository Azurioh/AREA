package com.example.area.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import com.example.area.data.api.RetrofitInstance
import com.example.area.data.models.ServicesValue
import com.example.area.data.models.ActionDetail
import com.example.area.data.models.ActionReactionRequest
import com.example.area.data.models.ActionReactionParams

class ServiceViewModel : ViewModel() {

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
                onError(e.message ?: "Erreur inconnue")
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
                onError(e.message ?: "Erreur inconnue")
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
                onError(e.message ?: "Erreur inconnue")
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
                onError(e.message ?: "Erreur inconnue")
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
                onError(e.message ?: "Erreur inconnue")
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
                onError(e.message ?: "Erreur inconnue")
            }
        }
    }
}
