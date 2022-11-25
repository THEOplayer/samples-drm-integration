package com.theoplayer.contentprotectionintegration.integration.verimatrixcoredrm

import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration
import com.theoplayer.android.api.contentprotection.CertificateRequestCallback
import com.theoplayer.android.api.contentprotection.LicenseRequestCallback
import com.theoplayer.android.api.contentprotection.Request
import java.lang.NullPointerException

private const val HEADER_AUTH = "Authorization"
private const val PARAM_TOKEN = "drmToken"

class VerimatrixCoreWidevineContentProtectionIntegration(private val contentProtectionConfiguration: DRMConfiguration) :
    ContentProtectionIntegration() {

    init {
        if (contentProtectionConfiguration.integrationParameters["drmToken"] == null) {
            throw(NullPointerException("The Verimatrix drmToken can not be null"))
        }
    }

    private fun applyHeaders(request: Request): Request {
        if (request.body == null) {
            throw NullPointerException("The request body can not be null")
        }
        request.headers[HEADER_AUTH] = contentProtectionConfiguration.integrationParameters[PARAM_TOKEN] as String
        return request
    }

    override fun onCertificateRequest(request: Request, callback: CertificateRequestCallback) {
        callback.request(applyHeaders(request))
    }

    override fun onLicenseRequest(request: Request, callback: LicenseRequestCallback) {
        callback.request(applyHeaders(request))
    }
}