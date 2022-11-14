package com.theoplayer.contentprotectionintegration.integration.titanium

import android.util.Base64
import com.google.gson.Gson
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.contentprotectionintegration.BuildConfig
import com.theoplayer.contentprotectionintegration.device.DeviceInfo
import java.util.HashMap

object TitaniumBaseRegistration {

    private const val HEADER_CONTENT_TYPE = "Content-Type"
    private const val HEADER_AUTHORIZATION = "Authorization"
    private const val HEADER_TITANIUM_DRM_CDATA = "X-TITANIUM-DRM-CDATA"

    private const val PROP_AUTH_TOKEN = "authToken"
    private const val PROP_CUSTOMER_NAME = "customerName"
    private const val PROP_ACCOUNT_NAME = "accountName"
    private const val PROP_PORTAL_ID = "portalId"
    private const val PROP_FRIENDLY_NAME = "friendlyName"

    fun createTitaniumHeaders(configuration: DRMConfiguration, cdmType: TitaniumCDMDescription): HashMap<String, String> {
        val headers = HashMap<String, String>()
        headers[HEADER_CONTENT_TYPE] = "application/octet-stream"
        if (isTokenBasedTitaniumDRMConfiguration(configuration)) {
            headers[HEADER_AUTHORIZATION] = createTitaniumAuthHeader(configuration)
        } else {
            headers[HEADER_TITANIUM_DRM_CDATA] = createTitaniumDeviceHeader(configuration, cdmType)
        }
        return headers
    }

    private fun isTokenBasedTitaniumDRMConfiguration(configuration: DRMConfiguration): Boolean {
        return configuration.integrationParameters.containsKey(PROP_AUTH_TOKEN)
    }

    private fun createTitaniumAuthHeader(configuration: DRMConfiguration) : String {
        return "Bearer ${configuration.integrationParameters[PROP_AUTH_TOKEN]}"
    }

    private fun getTitaniumDeviceAuthorizationData(integrationParameters: Map<String, Any>, cdmType: TitaniumCDMDescription) : TitaniumDeviceAuthorizationData {
        return TitaniumDeviceAuthorizationData(
            TitaniumLatensRegistration(
                CustomerName = integrationParameters[PROP_CUSTOMER_NAME] as String,
                AccountName = integrationParameters[PROP_ACCOUNT_NAME] as String,
                PortalId = integrationParameters[PROP_PORTAL_ID] as String,
                FriendlyName = integrationParameters[PROP_FRIENDLY_NAME] as String,
                AppVersion = BuildConfig.VERSION_NAME,
                DeviceInfo = TitaniumDeviceInfo(
                    FormatVersion = "1",
                    DeviceType = DeviceInfo.deviceTypeAsString,
                    OSType = "Android",
                    OSVersion = DeviceInfo.osVersionAsString,
                    DRMProvider = cdmType.DRMProvider,
                    DRMVersion = cdmType.DRMVersion,
                    DRMType = cdmType.DRMType,
                    DeviceVendor = DeviceInfo.brand,
                    DeviceModel = DeviceInfo.model
                )
            )
        )
    }

    private fun createTitaniumDeviceHeader(configuration: DRMConfiguration, cdmType: TitaniumCDMDescription): String {
        val deviceAuthorizationData = getTitaniumDeviceAuthorizationData(configuration.integrationParameters, cdmType)
        val jsonData = Gson().toJson(deviceAuthorizationData)
        return Base64.encodeToString(jsonData.toByteArray(), Base64.NO_WRAP)
    }
}
