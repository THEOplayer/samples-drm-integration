package com.theoplayer.contentprotectionintegration.integration.azuredrm

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory
import com.theoplayer.android.api.source.drm.DRMConfiguration
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration

class AzureWidevineContentProtectionIntegrationFactory : ContentProtectionIntegrationFactory {
    override fun build(configuration: DRMConfiguration): ContentProtectionIntegration {
        return AzureWidevineContentProtectionIntegration(configuration)
    }
}