package com.theoplayer.contentprotectionintegration.integration.vudrm;

import com.theoplayer.android.api.contentprotection.CertificateRequestCallback;
import com.theoplayer.android.api.contentprotection.CertificateResponseCallback;
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration;
import com.theoplayer.android.api.contentprotection.LicenseRequestCallback;
import com.theoplayer.android.api.contentprotection.Request;
import com.theoplayer.android.api.contentprotection.Response;
import com.theoplayer.android.api.source.drm.DRMConfiguration;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class VudrmWidevineContentProtectionIntegration extends ContentProtectionIntegration {

    static final String DEFAULT_LICENSE_URL = "https://widevine-proxy.drm.technology/proxy";

    private final DRMConfiguration contentProtectionConfiguration;

    public VudrmWidevineContentProtectionIntegration(DRMConfiguration configuration) {
        this.contentProtectionConfiguration = configuration;
    }

    private Request wrapRequest(Request request) {
        if (request.getBody() == null) {
            throw new NullPointerException("The request body can not be null");
        }
        final Object token = this.contentProtectionConfiguration.getIntegrationParameters().get("token");
        if (token == null) {
            throw new NullPointerException("The Widevine vuDRM token can not be null");
        }

        String licenseUrl = DEFAULT_LICENSE_URL;
        if (contentProtectionConfiguration.getWidevine() != null) {
            licenseUrl = contentProtectionConfiguration.getWidevine().getLicenseAcquisitionURL();
        }
        request.setUrl(licenseUrl);
        request.getHeaders().put("Content-Type", "text/plain");

        final Object kid = contentProtectionConfiguration.getIntegrationParameters().get("keyId");
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("token", token);
            jsonBody.put("drm_info", toUint8JsonArray(request.getBody()));
            jsonBody.put("kid", kid);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        request.setBody(jsonBody.toString().getBytes());
        return request;
    }

    public void onCertificateRequest(Request request, final CertificateRequestCallback callback) {
        try {
            callback.request(wrapRequest(request));
        } catch (Throwable error) {
            callback.error(error);
        }
    }

    public void onLicenseRequest(final Request request, LicenseRequestCallback callback) {
        try {
            callback.request(wrapRequest(request));
        } catch (Throwable error) {
            callback.error(error);
        }
    }

    private JSONArray toUint8JsonArray(final byte [] bytes) {
        JSONArray jsonArray = new JSONArray();
        for (byte aByte : bytes) {
            jsonArray.put(aByte & 0xff);
        }
        return jsonArray;
    }
}
