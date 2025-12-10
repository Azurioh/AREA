package com.example.area.data.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AboutJson(
    @SerialName("client")
    val client: Client,
    @SerialName("server")
    val server: Server
)

@Serializable
data class Client(
    @SerialName("host")
    val host: String
)

@Serializable
data class Server(
    @SerialName("current_time")
    val currentTime: Long,
    @SerialName("services")
    val services: List<Service>
)

@Serializable
data class Service(
    @SerialName("name")
    val name: String,
    @SerialName("actions")
    val actions: List<Action>,
    @SerialName("reactions")
    val reactions: List<Reaction>
)

@Serializable
data class Action(
    @SerialName("name")
    val name: String,
    @SerialName("description")
    val description: String
)

@Serializable
data class Reaction(
    @SerialName("name")
    val name: String,
    @SerialName("description")
    val description: String
)