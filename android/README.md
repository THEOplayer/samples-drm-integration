## Getting started on Android

### Creating a new integration

First create a custom implementation of [ContentProtectionIntegration](https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/doc/android/latest/com/theoplayer/android/api/contentprotection/ContentProtectionIntegration.html)
in the [com.theoplayer.contentprotectionintegration.integration](/android/app/src/main/java/com/theoplayer/contentprotectionintegration/integration)
package.
This object defines handler methods that allow altering license and certificate requests and responses as part of the
DRM flow.
All methods are optional. They can be omitted if the integration does not require additional action, in which case the
default implementation will be used.

```java
package com.theoplayer.contentprotectionintegration.custom;

import com.theoplayer.android.api.contentprotection.CertificateRequestCallback;
import com.theoplayer.android.api.contentprotection.CertificateResponseCallback;
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration;
import com.theoplayer.android.api.contentprotection.LicenseRequestCallback;
import com.theoplayer.android.api.contentprotection.LicenseResponseCallback;
import com.theoplayer.android.api.contentprotection.Request;
import com.theoplayer.android.api.contentprotection.Response;
import com.theoplayer.android.api.source.drm.DRMConfiguration;

public class CustomContentProtectionIntegration extends ContentProtectionIntegration {

    private final DRMConfiguration contentProtectionConfiguration;

    public CustomContentProtectionIntegration(DRMConfiguration configuration) {
        this.contentProtectionConfiguration = configuration;
    }

    public void onCertificateRequest(Request request, CertificateRequestCallback callback) {
        callback.request(request);
    }

    public void onCertificateResponse(Response response, CertificateResponseCallback callback) {
        callback.respond(response.getBody());
    }

    public void onLicenseRequest(Request request, LicenseRequestCallback callback) {
        // final Object token = this.contentProtectionConfiguration.getIntegrationParameters().get("token");
        // request.getHeaders().put("x-token", token.toString());
        callback.request(request);
    }

    public void onLicenseResponse(Response response, LicenseResponseCallback callback) {
        callback.respond(response.getBody());
    }
}
```

Optional parameters needed for certificate or license requests, such as tokens, can be added to a
[DRMConfiguration](https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/doc/android/latest/com/theoplayer/android/api/source/drm/DRMConfiguration.html)
object that is passed when creating instances of the `CustomContentProtectionIntegration` class.
In the example, `CustomContentProtectionIntegration` adds a token from the configuration object as part of the headers
during a license request.

Next, create a [ContentProtectionIntegrationFactory](https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/doc/android/latest/com/theoplayer/android/api/contentprotection/ContentProtectionIntegrationFactory.html)
for building CustomContentProtectionIntegration instances.
THEOplayer will use this factory in its DRM flow whenever it needs a ContentProtectionIntegration instance that
matches with the content protected source. How THEOplayer knows which factory to take will be determined in the
`registerContentProtectionIntegration` step next.

```java
package com.theoplayer.contentprotectionintegration.custom;

import com.theoplayer.android.api.contentprotection.ContentProtectionIntegration;
import com.theoplayer.android.api.contentprotection.ContentProtectionIntegrationFactory;
import com.theoplayer.android.api.source.drm.DRMConfiguration;

public class CustomContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    @Override
    public ContentProtectionIntegration build(DRMConfiguration configuration) {
        return new CustomContentProtectionIntegration(configuration);
    }
}
```

An instance of `CustomContentProtectionIntegrationFactory` needs to be registered with THEOplayer's global instance in the
[SourceManager](/android/app/src/main/java/com/theoplayer/contentprotectionintegration/SourceManager.java)
by specifying a unique `integrationId`, such as `"CUSTOM"` in this example.

```java
String CUSTOM_ID = "CUSTOM";
THEOplayerGlobal.getSharedInstance(context).registerContentProtectionIntegration(
        CUSTOM_ID,
        KeySystemId.WIDEVINE,
        new CustomContentProtectionIntegrationFactory()
);
```

When the player now loads a source with a `customIntegrationId` that matches the `integrationId`
passed during registration, an instance of `CustomContentProtectionIntegration` will be created and used in the DRM flow.

Also add the source description here, which provides the manifest and license URLs along with any integration parameters.

```java
public class SourceManager {

    private void initSources(Context context) {
        // Custom content protect integration
        String CUSTOM_ID = "CUSTOM";
        THEOplayerGlobal.getSharedInstance(context).registerContentProtectionIntegration(
                CUSTOM_ID,
                KeySystemId.WIDEVINE,
                new CustomContentProtectionIntegrationFactory()
        );
        sources.put(
                "Custom Widevine",
                buildWidevineSourceDescription(
                        CUSTOM_ID,
                        "<insert_manifest_here>",
                        "<insert_license_url_here>",
                        new HashMap<String, Object>() {{
                            // optional integration parameters
                            // put("token", "<insert_token_here>");
                        }}
                )
        );
    
        // add other registrations & sources here ...
    }

    private SourceDescription buildWidevineSourceDescription(
            String integrationId,
            String manifestUrl,
            String licenseUrl,
            HashMap<String, Object> integrationParams) {
        return sourceDescription(
                typedSource(manifestUrl)
                        .setNativeRenderingEnabled(true)
                        .setNativeUiRenderingEnabled(false)
                        .drm(new DRMConfiguration.Builder()
                                .customIntegrationId(integrationId)
                                .integrationParameters(integrationParams)
                                .widevine(keySystemConfiguration(licenseUrl).build())
                                .build())
                        .build()
        ).build();
    }
}
``` 

Finally, build and run the app on an Android device or Android emulator.

### Available examples

- Vualto VuDRM
- Microsoft Azure DRM

### Testing an integration

- Add your THEOplayer Android Archive (AAR) into the [/android/app/libs/]() folder and rename it to `theoplayer.aar`.
- Depending on the features included in your THEOplayer build, include the necessary dependencies in `/android/app/build.gradle`.
- Open the `/android` folder in [Android Studio](https://developer.android.com/studio) and build the project.
- Make sure to fill in the necessary fields in `SourceManager` for the content integration that will be tested, such as the manifest url and any integration parameters.
- Attach either a physical Android device or start an Android emulator, and run the project.
