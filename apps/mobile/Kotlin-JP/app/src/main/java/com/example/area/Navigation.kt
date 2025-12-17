package com.example.area

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.area.data.api.RetrofitInstance
import com.example.area.pages.LoginPage
import com.example.area.pages.RegisterPage
import com.example.area.viewModel.UserViewModel

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Register : Screen("register")
    object Main : Screen("main")
}

@Composable
fun AppNavigation(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController(),
    userViewModel: UserViewModel = viewModel(),
    shouldLogout: Boolean = false,
    onLogoutHandled: () -> Unit = {}
) {
    val context = LocalContext.current
    val isLoggedIn = RetrofitInstance.getTokenManager().isLoggedIn()
    val startDestination = if (isLoggedIn) Screen.Main.route else Screen.Login.route

    LaunchedEffect(isLoggedIn) {
        if (isLoggedIn) {
            userViewModel.fetchUserProfile()
        }
    }

    LaunchedEffect(shouldLogout) {
        if (shouldLogout) {
            navController.navigate(Screen.Login.route) {
                popUpTo(0) { inclusive = true }
            }
            onLogoutHandled()
        }
    }
    NavHost(
        navController = navController,
        startDestination = startDestination,
        modifier = modifier
    ) {
        composable(Screen.Login.route) {
            LoginPage(
                userViewModel = userViewModel,
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                },
                onNavigateToMain = {
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Register.route) {
            RegisterPage(
                userViewModel = userViewModel,
                onNavigateToLogin = {
                    navController.navigate(Screen.Login.route)
                },
                onNavigateToMain = {
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Register.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Main.route) {
            MainScreenWithNav(
                userViewModel = userViewModel,
                onLogout = {
                    RetrofitInstance.getTokenManager().clearToken()
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Main.route) { inclusive = true }
                    }
                }
            )
        }
    }
}
