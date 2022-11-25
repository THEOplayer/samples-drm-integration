package com.theoplayer.contentprotectionintegration.integration.verimatrixcoredrm

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration

class VerimatrixCoreWidevineContentProtectionIntegrationFactory : ContentProtectionIntegrationFactory {
    override fun build(configuration: DRMConfiguration): ContentProtectionIntegration {
        return VerimatrixCoreWidevineContentProtectionIntegration(configuration)
    }
}