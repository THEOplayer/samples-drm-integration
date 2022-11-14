package com.theoplayer.contentprotectionintegration.integration.vudrm

import com.theoplayer.contentprotectionintegration.TypeUtils.fromByteArrayToUint8JsonArray
import com.theoplayer.contentprotectionintegration.TypeUtils.fromJsonToByteArray
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration
import org.json.JSONObject
import org.json.JSONException
import com.theoplayer.android.api.contentprotection.CertificateRequestCallback
import com.theoplayer.android.api.contentprotection.LicenseRequestCallback
import com.theoplayer.android.api.contentprotection.Request
import java.lang.NullPointerException

class VudrmWidevineContentProtectionIntegration(private val contentProtectionConfiguration: DRMConfiguration) :
    ContentProtectionIntegration() {

    companion object {
        const val DEFAULT_LICENSE_URL = "https://widevine-proxy.drm.technology/proxy"
    }

    private fun wrapRequest(request: Request): Request {
        if (request.body == null) {
            throw NullPointerException("The request body can not be null")
        }
        val token = contentProtectionConfiguration.integrationParameters["token"]
            ?: throw NullPointerException("The Widevine vuDRM token can not be null")
        var licenseUrl = DEFAULT_LICENSE_URL
        if (contentProtectionConfiguration.widevine != null) {
            licenseUrl = contentProtectionConfiguration.widevine!!.licenseAcquisitionURL
        }
        request.url = licenseUrl
        request.headers["Content-Type"] = "text/plain"
        val kid = contentProtectionConfiguration.integrationParameters["keyId"]
        val jsonBody = JSONObject()
        try {
            jsonBody.put("token", token)
            jsonBody.put("drm_info", fromByteArrayToUint8JsonArray(request.body!!))
            jsonBody.put("kid", kid)
        } catch (e: JSONException) {
            e.printStackTrace()
        }
        request.body = fromJsonToByteArray(jsonBody)
        return request
    }

    override fun onCertificateRequest(request: Request, callback: CertificateRequestCallback) {
        try {
            callback.request(wrapRequest(request))
        } catch (error: Throwable) {
            callback.error(error)
        }
    }

    override fun onLicenseRequest(request: Request, callback: LicenseRequestCallback) {
        try {
            callback.request(wrapRequest(request))
        } catch (error: Throwable) {
            callback.error(error)
        }
    }
}