package com.example.area.data.models

data class ActionParam(
    val key: String,
    val label: String,
    val placeholder: String,
    val type: String,
    val options: List<String>
)

data class ActionDetail(
    val name: String,
    val description: String,
    val params: List<ActionParam>
)