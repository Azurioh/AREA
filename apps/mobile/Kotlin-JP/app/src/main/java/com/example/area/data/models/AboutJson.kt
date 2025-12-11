package com.example.area.data.models

import com.google.gson.annotations.SerializedName
import kotlinx.serialization.Serializable

@Serializable
data class AboutJson(
    @SerializedName("client")
    val client: Client,
    @SerializedName("server")
    val server: Server
)

@Serializable
data class Client(
    @SerializedName("host")
    val host: String
)

@Serializable
data class Server(
    @SerializedName("current_time")
    val currentTime: Long,
    @SerializedName("services")
    val services: List<Service>
)

@Serializable
data class Service(
    @SerializedName("name")
    val name: String,
    @SerializedName("actions")
    val actions: List<ServicesValue>,
    @SerializedName("reactions")
    val reactions: List<ServicesValue>
)
