package com.example.area.data.models

data class ActionReactionDisplay(
    val id: String,
    val action: ActionReactionParams,
    val reaction: ActionReactionParams,
    val numberOfExecution: String,
    val executionState: Boolean,
)
