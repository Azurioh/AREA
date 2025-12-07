package com.example.area.data.models

import com.google.gson.annotations.SerializedName

data class ParamOption(
    @SerializedName("name")
    val label: String,
    @SerializedName("id")
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