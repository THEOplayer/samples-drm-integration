package com.theoplayer.contentprotectionintegration.integration.keyos;

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration;
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory;
import com.theoplayer.android.api.source.drm.DRMConfiguration;
import com.theoplayer.contentprotectionintegration.integration.keyos.KeyOsWidevineContentProtectionIntegration;

public class KeyOsWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    @Override
    public ContentProtectionIntegration build(DRMConfiguration configuration) {
        return new KeyOsWidevineContentProtectionIntegration(configuration);
    }
}


