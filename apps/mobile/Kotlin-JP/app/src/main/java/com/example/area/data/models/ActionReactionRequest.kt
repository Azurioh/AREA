package com.example.area.data.models

data class ActionReactionParams(
    val service: String,
    val name: String,
    val params: Map<String, Any>
)

data class ActionReactionRequest(
    val action: ActionReactionParams,
    val reaction: ActionReactionParams,
)
