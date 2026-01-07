package com.example.area.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.area.data.models.ActionDetail
import com.example.area.ui.theme.Accent
import com.example.area.ui.theme.montserratFontFamily
import com.example.area.ui.theme.poppinsFontFamily
import com.example.area.ui.theme.AppTheme
import coil.compose.AsyncImage

@Composable
fun ActionDetailCard(
    actionServiceImage: String,
    actionDetail: ActionDetail,
    onValidate: (Map<String, Any>) -> Unit
) {
    var paramValues by remember { mutableStateOf(mutableMapOf<String, Any>()) }

    ElevatedCard(
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = AppTheme.colors.secondary),
        modifier = Modifier
            .padding(12.dp)
            .fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    AsyncImage(
                        model = actionServiceImage,
                        contentDescription = "Service Image",
                        contentScale = ContentScale.Fit,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                    )

                    Text(
                        text = actionDetail.name.replace('_', ' ', ignoreCase = true).capitalize(),
                        fontFamily = poppinsFontFamily,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 17.sp,
                        color = Accent,
                        textAlign = TextAlign.Start
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = actionDetail.description,
                fontFamily = montserratFontFamily,
                fontWeight = FontWeight.Medium,
                fontSize = 13.sp,
                color = AppTheme.colors.textPrimary,
                lineHeight = 15.sp,
                textAlign = TextAlign.Start,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(20.dp))

            actionDetail.params.forEach { param ->
                when (param.type) {
                    "select" -> {
                        val currentValue = when (val stored = paramValues[param.key]) {
                            is Map<*, *> -> stored["id"]?.toString() ?: ""
                            else -> stored?.toString() ?: ""
                        }

                        ActionParamSelectField(
                            param = param,
                            value = currentValue,
                            onValueChange = { selectedValue ->
                                paramValues = paramValues.toMutableMap().apply {
                                    val selectedOption = param.options.find { it.value == selectedValue }
                                    if ((param.key == "repository" || param.key == "channel") && selectedOption != null) {
                                        val objectMap: Map<String, Any> = mapOf(
                                            "name" to selectedOption.label,
                                            "id" to (selectedOption.value.toIntOrNull() ?: selectedOption.value)
                                        )
                                        this[param.key] = objectMap
                                    } else {
                                        this[param.key] = selectedValue
                                    }
                                }
                            }
                        )
                    }
                    else -> {
                        ActionParamTextField(
                            param = param,
                            value = paramValues[param.key]?.toString() ?: "",
                            onValueChange = { newValue ->
                                paramValues = paramValues.toMutableMap().apply {
                                    this[param.key] = newValue
                                }
                            }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
            }

            Button(
                onClick = { onValidate(paramValues) },
                colors = ButtonDefaults.buttonColors(containerColor = Accent),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(
                    text = "Validate",
                    fontFamily = poppinsFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp
                )
            }
        }
    }
}
