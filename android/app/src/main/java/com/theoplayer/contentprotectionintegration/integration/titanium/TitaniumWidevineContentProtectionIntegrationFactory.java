package com.theoplayer.contentprotectionintegration.integration.titanium;

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration;
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory;
import com.theoplayer.android.api.source.drm.DRMConfiguration;

public class TitaniumWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    @Override
    public ContentProtectionIntegration build(DRMConfiguration configuration) {
        return new TitaniumWidevineContentProtectionIntegration(configuration);
    }
}
