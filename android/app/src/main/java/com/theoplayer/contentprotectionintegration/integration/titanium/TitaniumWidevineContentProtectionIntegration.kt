package com.theoplayer.contentprotectionintegration.integration.titanium

import com.theoplayer.android.api.contentprotection.*
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.contentprotectionintegration.integration.titanium.TitaniumBaseRegistration.createTitaniumHeaders

class TitaniumWidevineContentProtectionIntegration(private val configuration: DRMConfiguration):
    ContentProtectionIntegration() {

    override fun onCertificateRequest(request: Request, callback: CertificateRequestCallback) {
        request.apply {
            headers.putAll(createTitaniumHeaders(configuration, TitaniumWidevineCDMDescription))
            callback.request(this)
        }
    }

    override fun onLicenseRequest(request: Request, callback: LicenseRequestCallback) {
        request.apply {
            headers.putAll(createTitaniumHeaders(configuration, TitaniumWidevineCDMDescription))
            callback.request(this)
        }
    }
}
