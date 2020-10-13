package com.theoplayer.contentprotectionintegration;

import android.content.Context;

import com.theoplayer.android.api.THEOplayerGlobal;
import com.theoplayer.android.api.contentprotection.KeySystemId;
import com.theoplayer.android.api.source.SourceDescription;
import com.theoplayer.android.api.source.drm.DRMConfiguration;
import com.theoplayer.contentprotectionintegration.integration.azuredrm.AzureWidevineContentProtectionIntegrationFactory;
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

        // add other registrations & sources here ...
    }
}
