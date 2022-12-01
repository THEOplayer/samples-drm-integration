package com.theoplayer.contentprotectionintegration.device

import android.annotation.SuppressLint
import android.app.UiModeManager
import android.content.Context
import android.content.res.Configuration
import android.os.Build

@SuppressLint("StaticFieldLeak")
object DeviceInfo {
    fun init(context: Context) {
        deviceType = determineDeviceType(context)
    }

    lateinit var deviceType: DeviceType

    val deviceTypeAsString: String
        get() = deviceType.value

    val model: String
        get() = Build.MODEL

    val brand: String
        get() = Build.BRAND

    val osVersion: Int
        get() = Build.VERSION.SDK_INT

    val osVersionAsString: String
        get() = osVersion.toString()

    private fun determineDeviceType(context: Context): DeviceType {
        val uiManager = context.getSystemService(Context.UI_MODE_SERVICE) as UiModeManager
        if (uiManager.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION) {
            return DeviceType.TV
        }
        return if ((context.resources.configuration.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE)
            DeviceType.TABLET
        else
            DeviceType.PHONE
    }
}
