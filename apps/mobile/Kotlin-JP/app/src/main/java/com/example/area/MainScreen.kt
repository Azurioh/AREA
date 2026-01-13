package com.example.area

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.area.pages.HomePage
import com.example.area.pages.ProfilePage
import com.example.area.pages.CreatePage
import com.example.area.pages.SettingsPage
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.AppTheme
import com.example.area.ui.theme.CustomWhite
import com.example.area.viewModel.ServiceViewModel
import com.example.area.viewModel.UserViewModel

data class NavItemState(
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val hasBadge: Boolean,
    val messages: Int
)

@Composable
fun MainScreenWithNav(
    modifier: Modifier = Modifier,
    userViewModel: UserViewModel = viewModel(),
    serviceViewModel: ServiceViewModel = viewModel(),
    onLogout: () -> Unit = {}
) {

    val items = listOf(
        NavItemState(
            title = "Home",
            selectedIcon = Icons.Filled.Home,
            unselectedIcon = Icons.Outlined.Home,
            hasBadge = false,
            messages = 0
        ),
        NavItemState(
            title = "Create",
            selectedIcon = Icons.Filled.Add,
            unselectedIcon = Icons.Outlined.Add,
            hasBadge = false,
            messages = 0
        ),
        NavItemState(
            title = "Profile",
            selectedIcon = Icons.Filled.Person,
            unselectedIcon = Icons.Outlined.Person,
            hasBadge = false,
            messages = 0
        ),
        NavItemState(
            title = "Settings",
            selectedIcon = Icons.Filled.Settings,
            unselectedIcon = Icons.Outlined.Settings,
            hasBadge = false,
            messages = 0
        )
    )
    var bottomNavState by rememberSaveable { mutableStateOf(0) }

    Scaffold(
        containerColor = Color.Transparent,
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        bottomBar = {
            NavigationBar(
                modifier
                    .padding(15.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .height(70.dp),
                containerColor = Accent,
                windowInsets = WindowInsets(0, 0, 0, 0)
            ) {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        selected = bottomNavState == index,
                        onClick = { bottomNavState = index },
                        icon = {
                            BadgedBox(badge = {
                                if (item.hasBadge) Badge()
                                if (item.messages != 0) Badge {
                                    Text(
                                        text = "${item.messages}",
                                        fontFamily = AppTheme.fonts.primary
                                    )
                                }
                            }) {
                                Icon(
                                    imageVector = if (bottomNavState == index) item.selectedIcon
                                    else item.unselectedIcon,
                                    contentDescription = item.title
                                )
                            }
                        },
                        label = {
                            Text(
                                text = item.title,
                                fontFamily = AppTheme.fonts.primary
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = CustomWhite,
                            unselectedIconColor = CustomWhite,
                            selectedTextColor = CustomWhite,
                            unselectedTextColor = CustomWhite,
                            indicatorColor = Accent
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.fillMaxSize()) {
            LaunchedEffect(Unit) {
                serviceViewModel.getAboutJson(
                    onSuccess = { aboutJson ->
                        println("AboutJson loaded: ${aboutJson.server}")
                    },
                    onError = { error ->
                        println("Error loading aboutJson: $error")
                    }
                )
            }
            ContentScreen(
                modifier = Modifier.fillMaxSize(),
                selectedIndex = bottomNavState,
                userViewModel = userViewModel,
                serviceViewModel = serviceViewModel,
                onLogout = onLogout,
                onNavigateToProfile = { bottomNavState = 2 },
                bottomPadding = paddingValues.calculateBottomPadding()
            )
        }
    }
}

@Composable
fun ContentScreen(
    modifier: Modifier = Modifier,
    selectedIndex: Int,
    userViewModel: UserViewModel,
    serviceViewModel: ServiceViewModel,
    onLogout: () -> Unit = {},
    onNavigateToProfile: () -> Unit = {},
    bottomPadding: androidx.compose.ui.unit.Dp = 0.dp
) {
    LaunchedEffect(selectedIndex) {
        userViewModel.fetchUserProfile()
    }

    when(selectedIndex) {
        0 -> HomePage(modifier = modifier)
        1 -> CreatePage(modifier = modifier, serviceViewModel = serviceViewModel, onNavigateToProfile = onNavigateToProfile)
        2 -> ProfilePage(modifier = modifier, userViewModel = userViewModel, serviceViewModel = serviceViewModel)
        3 -> SettingsPage(modifier = modifier, userViewModel = userViewModel, onLogout = onLogout)
    }
}