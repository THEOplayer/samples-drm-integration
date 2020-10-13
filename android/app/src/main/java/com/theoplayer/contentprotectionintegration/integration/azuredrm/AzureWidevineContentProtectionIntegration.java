package com.theoplayer.contentprotectionintegration.integration.azuredrm;

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration;
import com.theoplayer.android.api.contentprotection.LicenseRequestCallback;
import com.theoplayer.android.api.contentprotection.Request;
import com.theoplayer.android.api.source.drm.DRMConfiguration;

public class AzureWidevineContentProtectionIntegration extends ContentProtectionIntegration {

    private final DRMConfiguration contentProtectionConfiguration;

    public AzureWidevineContentProtectionIntegration(DRMConfiguration configuration) {
        this.contentProtectionConfiguration = configuration;
    }

    public void onLicenseRequest(final Request request, LicenseRequestCallback callback) {
        Object token = contentProtectionConfiguration.getIntegrationParameters().get("token");
        if (token == null) {
            callback.error(new NullPointerException("The Azure drm token can not be null"));
            return;
        }
        String licenseUrl = null;
        if (contentProtectionConfiguration.getWidevine() != null) {
            licenseUrl = contentProtectionConfiguration.getWidevine().getLicenseAcquisitionURL();
        }
        if (licenseUrl == null) {
            callback.error(new NullPointerException("The Azure licenseAcquisitionURL can not be null"));
            return;
        }
        request.setUrl(licenseUrl);
        request.getHeaders().put(
                "Authorization",
                "Bearer " + token.toString());
        callback.request(request);
    }
}
