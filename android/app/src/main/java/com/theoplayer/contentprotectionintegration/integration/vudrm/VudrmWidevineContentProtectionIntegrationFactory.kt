package com.theoplayer.contentprotectionintegration.integration.vudrm

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration

class VudrmWidevineContentProtectionIntegrationFactory : ContentProtectionIntegrationFactory {
    override fun build(configuration: DRMConfiguration): ContentProtectionIntegration {
        return VudrmWidevineContentProtectionIntegration(configuration)
    }
}