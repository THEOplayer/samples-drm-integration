package com.theoplayer.contentprotectionintegration.integration.azuredrm

import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration
import com.theoplayer.android.api.contentprotection.LicenseRequestCallback
import com.theoplayer.android.api.contentprotection.Request
import java.lang.NullPointerException

class AzureWidevineContentProtectionIntegration(private val contentProtectionConfiguration: DRMConfiguration) :
    ContentProtectionIntegration() {
    override fun onLicenseRequest(request: Request, callback: LicenseRequestCallback) {
        val token = contentProtectionConfiguration.integrationParameters["token"]
        if (token == null) {
            callback.error(NullPointerException("The Azure drm token can not be null"))
            return
        }
        var licenseUrl: String? = null
        if (contentProtectionConfiguration.widevine != null) {
            licenseUrl = contentProtectionConfiguration.widevine!!.licenseAcquisitionURL
        }
        if (licenseUrl == null) {
            callback.error(NullPointerException("The Azure licenseAcquisitionURL can not be null"))
            return
        }
        request.url = licenseUrl
        request.headers["Authorization"] = "Bearer $token"
        callback.request(request)
    }
}