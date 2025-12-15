package com.example.area.data.models

import com.google.gson.annotations.SerializedName

data class ActionReactionDisplay(
    @SerializedName("_id")
    val id: String?,
    val action: ActionReactionParams,
    val reaction: ActionReactionParams,
    val numberOfExecution: String,
    val executionState: Boolean,
)
