package com.theoplayer.contentprotectionintegration.integration.keyos

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory
import com.theoplayer.android.api.source.drm.DRMConfiguration

class KeyOsWidevineContentProtectionIntegrationFactory : ContentProtectionIntegrationFactory {
    override fun build(configuration: DRMConfiguration): ContentProtectionIntegration {
        return KeyOsWidevineContentProtectionIntegration(configuration)
    }
}