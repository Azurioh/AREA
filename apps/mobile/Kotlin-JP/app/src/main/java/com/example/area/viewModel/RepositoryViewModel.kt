package com.example.area.viewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.State
import com.example.area.data.api.RetrofitInstance

class RepositoryViewModel : ViewModel() {

    private val _repositories = mutableStateOf<List<String>>(emptyList())
    val repositories: State<List<String>> = _repositories

    fun loadRepositories() {
        viewModelScope.launch {
            try {
                val response = RetrofitInstance.api.getRepositories()
                _repositories.value = response
            } catch (e: Exception) {
                println(">>> Erreur : $e")
            }
        }
    }
}
