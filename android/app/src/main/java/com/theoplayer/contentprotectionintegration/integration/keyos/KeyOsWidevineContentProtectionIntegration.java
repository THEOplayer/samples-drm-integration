package com.theoplayer.contentprotectionintegration.integration.keyos;

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration;
import com.theoplayer.android.api.contentprotection.LicenseRequestCallback;
import com.theoplayer.android.api.contentprotection.Request;
import com.theoplayer.android.api.source.drm.DRMConfiguration;

public class KeyOsWidevineContentProtectionIntegration extends ContentProtectionIntegration {
    private final DRMConfiguration contentProtectionConfiguration;

    public KeyOsWidevineContentProtectionIntegration(DRMConfiguration configuration) {
        this.contentProtectionConfiguration = configuration;
    }

    @Override
    public void onLicenseRequest(Request request, LicenseRequestCallback callback) {

        if (this.contentProtectionConfiguration.getWidevine() == null) {
            throw new NullPointerException("The license acquisition URL can not be null");
        }

        request.setUrl(contentProtectionConfiguration.getWidevine().getLicenseAcquisitionURL());
        request.getHeaders().put(
                "customdata",
                contentProtectionConfiguration.getIntegrationParameters().get("customdata").toString()
        );
        callback.request(request);
    }
}
