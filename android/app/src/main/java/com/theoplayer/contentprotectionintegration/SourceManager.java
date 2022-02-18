package com.theoplayer.contentprotectionintegration;

import android.content.Context;

import com.theoplayer.android.api.THEOplayerGlobal;
import com.theoplayer.android.api.contentprotection.KeySystemId;
import com.theoplayer.android.api.source.SourceDescription;
import com.theoplayer.android.api.source.drm.DRMConfiguration;
import com.theoplayer.contentprotectionintegration.integration.azuredrm.AzureWidevineContentProtectionIntegrationFactory;
import com.theoplayer.contentprotectionintegration.integration.keyos.KeyOsWidevineContentProtectionIntegrationFactory;
import com.theoplayer.contentprotectionintegration.integration.vudrm.VudrmWidevineContentProtectionIntegrationFactory;

import java.util.HashMap;

import static com.theoplayer.android.api.source.SourceDescription.Builder.sourceDescription;
import static com.theoplayer.android.api.source.TypedSource.Builder.typedSource;
import static com.theoplayer.android.api.source.drm.KeySystemConfiguration.Builder.keySystemConfiguration;

public class SourceManager {

    private static SourceManager instance = null;

    private HashMap<String, SourceDescription> sources = new HashMap<>();

    private SourceManager(Context context) {
        initSources(context);
    }

    public static SourceManager getInstance(Context context) {
        if (SourceManager.instance == null) {
            instance = new SourceManager(context);
        }
        return instance;
    }

    public SourceDescription getSource(String name) {
        return sources.get(name);
    }

    public String[] getSourcesNames() {
        return sources.keySet().toArray(new String[0]);
    }

    private SourceDescription buildWidevineSourceDescription(
            String integrationId,
            String manifestUrl,
            String licenseUrl,
            HashMap<String, Object> integrationParams) {
        return sourceDescription(
                typedSource(manifestUrl)
                        .drm(new DRMConfiguration.Builder()
                                .customIntegrationId(integrationId)
                                .integrationParameters(integrationParams)
                                .widevine(keySystemConfiguration(licenseUrl).build())
                                .build())
                        .build()
        ).build();
    }

    private void initSources(Context context) {
        // Vualto VUDRM Widevine content protect integration
        String VUDRM_ID = "VUDRM";
        THEOplayerGlobal.getSharedInstance(context).registerContentProtectionIntegration(
                VUDRM_ID,
                KeySystemId.WIDEVINE,
                new VudrmWidevineContentProtectionIntegrationFactory()
        );
        sources.put(
                "Vualto VUDRM Widevine",
                buildWidevineSourceDescription(
                        VUDRM_ID,
                        "<insert_vudrm_manifest_here>",
                        "<insert_vudrm_license_url_here>",
                        new HashMap<String, Object>() {{
                            put("token", "<insert_token_here>");
                            put("keyId", "<insert_key_id_here>");
                        }}
                )
        );

        // Microsoft Azure Widevine content protect integration
        String AZURE_ID = "AZURE";
        THEOplayerGlobal.getSharedInstance(context).registerContentProtectionIntegration(
                AZURE_ID,
                KeySystemId.WIDEVINE,
                new AzureWidevineContentProtectionIntegrationFactory()
        );
        sources.put(
                "Microsoft Azure Widevine",
                buildWidevineSourceDescription(
                        AZURE_ID,
                        "<insert_vudrm_manifest_here>",
                        "<insert_vudrm_license_url_here>",
                        new HashMap<String, Object>() {{
                            put("token", "<insert_token_here>");
                        }}
                )
        );

        // BuyDRM KeyOS Widevine content protect integration
        String KEYOS_ID = "buydrm-keyos";
        THEOplayerGlobal.getSharedInstance(context).registerContentProtectionIntegration(
                KEYOS_ID,
                KeySystemId.WIDEVINE,
                new KeyOsWidevineContentProtectionIntegrationFactory()
        );
        sources.put(
                "BuyDRM KeyOs Widevine",
                buildWidevineSourceDescription(
                        KEYOS_ID,
                        "https://d2jl6e4h8300i8.cloudfront.net/netflix_meridian/4k-18.5!9/keyos-logo/g180-avc_a2.0-vbr-aac-128k/r30/dash-wv-pr/stream.mpd",
                        "https://wv-keyos.licensekeyserver.com",
                        new HashMap<String, Object>() {{
                            put("x-keyos-authorization", "PEtleU9TQXV0aGVudGljYXRpb25YTUw+PERhdGE+PEdlbmVyYXRpb25UaW1lPjIwMTYtMTEtMTkgMDk6MzQ6MDEuOTkyPC9HZW5lcmF0aW9uVGltZT48RXhwaXJhdGlvblRpbWU+MjAyNi0xMS0xOSAwOTozNDowMS45OTI8L0V4cGlyYXRpb25UaW1lPjxVbmlxdWVJZD4wZmZmMTk3YWQzMzQ0ZTMyOWU0MTA0OTIwMmQ5M2VlYzwvVW5pcXVlSWQ+PFJTQVB1YktleUlkPjdlMTE0MDBjN2RjY2QyOWQwMTc0YzY3NDM5N2Q5OWRkPC9SU0FQdWJLZXlJZD48V2lkZXZpbmVQb2xpY3kgZmxfQ2FuUGxheT0idHJ1ZSIgZmxfQ2FuUGVyc2lzdD0iZmFsc2UiIC8+PFdpZGV2aW5lQ29udGVudEtleVNwZWMgVHJhY2tUeXBlPSJIRCI+PFNlY3VyaXR5TGV2ZWw+MTwvU2VjdXJpdHlMZXZlbD48L1dpZGV2aW5lQ29udGVudEtleVNwZWM+PEZhaXJQbGF5UG9saWN5IC8+PExpY2Vuc2UgdHlwZT0ic2ltcGxlIiAvPjwvRGF0YT48U2lnbmF0dXJlPk1sNnhkcU5xc1VNalNuMDdicU8wME15bHhVZUZpeERXSHB5WjhLWElBYlAwOE9nN3dnRUFvMTlYK1c3MDJOdytRdmEzNFR0eDQydTlDUlJPU1NnREQzZTM4aXE1RHREcW9HelcwS2w2a0JLTWxHejhZZGRZOWhNWmpPTGJkNFVkRnJUbmxxU21raC9CWnNjSFljSmdaUm5DcUZIbGI1Y0p0cDU1QjN4QmtxMUREZUEydnJUNEVVcVJiM3YyV1NueUhGeVZqWDhCR3o0ZWFwZmVFeDlxSitKbWI3dUt3VjNqVXN2Y0Fab1ozSHh4QzU3WTlySzRqdk9Wc1I0QUd6UDlCc3pYSXhKd1ZSZEk3RXRoMjhZNXVEQUVZVi9hZXRxdWZiSXIrNVZOaE9yQ2JIVjhrR2praDhHRE43dC9nYWh6OWhVeUdOaXRqY2NCekJvZHRnaXdSUT09PC9TaWduYXR1cmU+PC9LZXlPU0F1dGhlbnRpY2F0aW9uWE1MPg==");
                        }}
                )
        );

        // add other registrations & sources here ...
    }
}
