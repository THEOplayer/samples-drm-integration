package com.theoplayer.contentprotectionintegration

import android.content.Context
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.contentprotection.KeySystemId
import com.theoplayer.android.api.source.TypedSource
import com.theoplayer.android.api.source.drm.KeySystemConfiguration
import com.theoplayer.contentprotectionintegration.integration.vudrm.VudrmWidevineContentProtectionIntegrationFactory
import com.theoplayer.contentprotectionintegration.integration.azuredrm.AzureWidevineContentProtectionIntegrationFactory
import com.theoplayer.contentprotectionintegration.integration.keyos.KeyOsWidevineContentProtectionIntegrationFactory
import com.theoplayer.contentprotectionintegration.integration.titanium.TitaniumWidevineContentProtectionIntegrationFactory
import java.util.HashMap

@Suppress("SameParameterValue")
class SourceManager private constructor(context: Context) {
    companion object {
        private var instance: SourceManager? = null
        fun getInstance(context: Context): SourceManager {
            if (instance == null) {
                instance = SourceManager(context)
            }
            return instance!!
        }
    }

    private val sources = HashMap<String, SourceDescription>()

    init {
        initSources(context)
    }

    fun getSource(name: String?): SourceDescription? {
        return sources[name]
    }

    val sourcesNames: Array<String>
        get() = sources.keys.toTypedArray()

    private fun buildWidevineSourceDescription(
        integrationId: String,
        manifestUrl: String,
        licenseUrl: String,
        integrationParams: HashMap<String, Any>
    ): SourceDescription {
        return SourceDescription.Builder(
            TypedSource.Builder(manifestUrl)
                .drm(DRMConfiguration.Builder()
                    .customIntegrationId(integrationId)
                    .integrationParameters(integrationParams)
                    .widevine(KeySystemConfiguration.Builder(licenseUrl).build())
                    .build())
                .build()
        ).build()
    }

    private fun buildDefaultWidevineSourceDescription(
        manifestUrl: String,
        licenseUrl: String,
        headers: HashMap<String, String>
    ): SourceDescription {
        return SourceDescription.Builder(
            TypedSource.Builder(manifestUrl)
                .drm(DRMConfiguration.Builder()
                    .widevine(KeySystemConfiguration.Builder(licenseUrl)
                        .headers(headers)
                        .build())
                    .build())
                .build()
        ).build()
    }

    private fun initSources(context: Context) {
        // Vualto VUDRM Widevine content protect integration
        val VUDRM_ID = "VUDRM"
        THEOplayerGlobal.getSharedInstance(context).registerContentProtectionIntegration(
            VUDRM_ID,
            KeySystemId.WIDEVINE,
            VudrmWidevineContentProtectionIntegrationFactory()
        )
        sources["Vualto VUDRM Widevine"] = buildWidevineSourceDescription(
            VUDRM_ID,
            "<insert_manifest_here>",
            "<insert_license_url_here>",
            hashMapOf(
                "token" to "<insert_token_here>",
                "keyId" to "<insert_key_id_here>"
            )
        )

        // Microsoft Azure Widevine content protect integration
        val AZURE_ID = "AZURE"
        THEOplayerGlobal.getSharedInstance(context).registerContentProtectionIntegration(
            AZURE_ID,
            KeySystemId.WIDEVINE,
            AzureWidevineContentProtectionIntegrationFactory()
        )
        sources["Microsoft Azure Widevine"] = buildWidevineSourceDescription(
            AZURE_ID,
            "<insert_manifest_here>",
            "<insert_license_url_here>",
            hashMapOf(
                "token" to "<insert_token_here>",
            )
        )

        // BuyDRM KeyOS Widevine content protect integration
        val KEYOS_ID = "buydrm-keyos"
        THEOplayerGlobal.getSharedInstance(context).registerContentProtectionIntegration(
            KEYOS_ID,
            KeySystemId.WIDEVINE,
            KeyOsWidevineContentProtectionIntegrationFactory()
        )
        sources["BuyDRM KeyOs Widevine"] = buildWidevineSourceDescription(
            KEYOS_ID,
            "https://d2jl6e4h8300i8.cloudfront.net/netflix_meridian/4k-18.5!9/keyos-logo/g180-avc_a2.0-vbr-aac-128k/r30/dash-wv-pr/stream.mpd",
            "https://wv-keyos.licensekeyserver.com",
            hashMapOf(
                "x-keyos-authorization" to "PEtleU9TQXV0aGVudGljYXRpb25YTUw+PERhdGE+PEdlbmVyYXRpb25UaW1lPjIwMTYtMTEtMTkgMDk6MzQ6MDEuOTkyPC9HZW5lcmF0aW9uVGltZT48RXhwaXJhdGlvblRpbWU+MjAyNi0xMS0xOSAwOTozNDowMS45OTI8L0V4cGlyYXRpb25UaW1lPjxVbmlxdWVJZD4wZmZmMTk3YWQzMzQ0ZTMyOWU0MTA0OTIwMmQ5M2VlYzwvVW5pcXVlSWQ+PFJTQVB1YktleUlkPjdlMTE0MDBjN2RjY2QyOWQwMTc0YzY3NDM5N2Q5OWRkPC9SU0FQdWJLZXlJZD48V2lkZXZpbmVQb2xpY3kgZmxfQ2FuUGxheT0idHJ1ZSIgZmxfQ2FuUGVyc2lzdD0iZmFsc2UiIC8+PFdpZGV2aW5lQ29udGVudEtleVNwZWMgVHJhY2tUeXBlPSJIRCI+PFNlY3VyaXR5TGV2ZWw+MTwvU2VjdXJpdHlMZXZlbD48L1dpZGV2aW5lQ29udGVudEtleVNwZWM+PEZhaXJQbGF5UG9saWN5IC8+PExpY2Vuc2UgdHlwZT0ic2ltcGxlIiAvPjwvRGF0YT48U2lnbmF0dXJlPk1sNnhkcU5xc1VNalNuMDdicU8wME15bHhVZUZpeERXSHB5WjhLWElBYlAwOE9nN3dnRUFvMTlYK1c3MDJOdytRdmEzNFR0eDQydTlDUlJPU1NnREQzZTM4aXE1RHREcW9HelcwS2w2a0JLTWxHejhZZGRZOWhNWmpPTGJkNFVkRnJUbmxxU21raC9CWnNjSFljSmdaUm5DcUZIbGI1Y0p0cDU1QjN4QmtxMUREZUEydnJUNEVVcVJiM3YyV1NueUhGeVZqWDhCR3o0ZWFwZmVFeDlxSitKbWI3dUt3VjNqVXN2Y0Fab1ozSHh4QzU3WTlySzRqdk9Wc1I0QUd6UDlCc3pYSXhKd1ZSZEk3RXRoMjhZNXVEQUVZVi9hZXRxdWZiSXIrNVZOaE9yQ2JIVjhrR2praDhHRE43dC9nYWh6OWhVeUdOaXRqY2NCekJvZHRnaXdSUT09PC9TaWduYXR1cmU+PC9LZXlPU0F1dGhlbnRpY2F0aW9uWE1MPg==",
            )
        )

        // Verimatrix Multi-DRM Core
        sources["Verimatrix Multi-DRM Core"] = buildDefaultWidevineSourceDescription(
            "<insert_manifest_here>",
            "https://multidrm.vsaas.verimatrixcloud.net/widevine",
            hashMapOf(
                "authorization" to "<base64_auth_key>",
            )
        )

        // Verimatrix MultiDRM Standard
        sources["Verimatrix MultiDRM Standard"] = buildDefaultWidevineSourceDescription(
            "<insert_manifest_here>",
            "https://vcas4-gc.emea.vmxdemos.net/widevine?deviceId=<deviceId>",
            hashMapOf()
        )

        // add other registrations & sources here ...
    }
}