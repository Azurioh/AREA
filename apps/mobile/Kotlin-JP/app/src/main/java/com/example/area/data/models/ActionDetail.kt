package com.example.area.data.models

import kotlinx.serialization.SerialName

data class ParamOption(
    @SerialName("name")
    val label: String,
    @SerialName("id")
    val value: String
)

data class ActionParam(
    val key: String,
    val label: String,
    val placeholder: String,
    val type: String,
    val options: List<ParamOption> = emptyList()
)

data class ActionDetail(
    val name: String,
    val description: String,
    val params: List<ActionParam> = emptyList()
)