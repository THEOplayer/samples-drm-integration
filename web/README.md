## Getting started on Web

### Creating a new integration

First create a custom implementation of [ContentProtectionIntegration](https://docs.portal.theoplayer.com/api-reference/web/theoplayer.contentprotectionintegration.md)
under `src/integration/custom`. This object defines handler methods that allow altering license and certificate requests and responses as part of the
DRM flow.
All methods are optional. They can be omitted if the integration does not require additional action, in which case the
default implementation will be used.

```ts 
import {
    ContentProtectionIntegration,
    CertificateRequest,
    MaybeAsync,
    BufferSource,
    CertificateResponse,
    LicenseRequest,
    LicenseResponse
} from 'THEOplayer';
import { CustomDRMConfiguration } from './CustomDRMConfiguration';

export class CustomContentProtectionIntegration implements ContentProtectionIntegration {
    constructor(private readonly contentProtectionConfiguration: CustomDRMConfiguration) {
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        throw new Error('not implemented yet');
    }

    onCertificateResponse(response: CertificateResponse): MaybeAsync<BufferSource> {
        throw new Error('not implemented yet');
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        // const token = this.contentProtectionConfiguration.integrationParameters.token;
        // request.headers = {
        //     ...request.headers,
        //     'x-token': token
        // };
        // return request;
        throw new Error('not implemented yet');
    }

    onLicenseResponse(response: LicenseResponse): MaybeAsync<BufferSource> {
        throw new Error('not implemented yet');
    }
    
    extractFairplayContentId?(skdUrl: string): string {
        throw new Error('not implemented yet');
    }
}
``` 

Optional parameters needed for certificate or license requests, such as tokens, can be added to a [DRMConfiguration](https://docs.portal.theoplayer.com/api-reference/web/theoplayer.drmconfiguration.md/#drmconfiguration-interface)
object that is passed when creating instances of the `CustomContentProtectionIntegration` class.

```ts
import { DRMConfiguration } from 'THEOplayer';

export interface CustomDRMConfiguration extends DRMConfiguration {
    integrationParameters: {
        token: string;
        // any other parameters
    };
}
```

In the example, `CustomContentProtectionIntegration` adds a token from the configuration object as part of the headers
during a license request.

Next, create a [ContentProtectionIntegrationFactory](https://docs.portal.theoplayer.com/api-reference/web/theoplayer.contentprotectionintegrationfactory.md)
for building `CustomContentProtectionIntegration` instances.
THEOplayer will use this factory in its DRM flow whenever it needs a ContentProtectionIntegration instance that
matches with the content protected source. How THEOplayer knows which factory to take will be determined in the
`registerContentProtectionIntegration` step later on.

```ts
import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory,
    DRMConfiguration
} from 'THEOplayer';
import { CustomContentProtectionIntegration } from './CustomContentProtectionIntegration';

export class CustomContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: CustomDRMConfiguration): ContentProtectionIntegration {
        return new CustomContentProtectionIntegration(configuration);
    }
}
```

Before the factory can be used externally, it needs to be exported in the bundle's entry point `src/index.ts`.

```ts
import { CustomContentProtectionIntegrationFactory } from './integration/custom/CustomContentProtectionIntegrationFactory';

export {
    // ...
    CustomContentProtectionIntegrationFactory
};
``` 

The final step, after updating the integrations library with `npm build`, is creating a web page under `test/custom`.

An instance of `CustomContentProtectionIntegrationFactory` needs to be
[registered](https://docs.portal.theoplayer.com/api-reference/web/theoplayer.registercontentprotectionintegration.md/#registercontentprotectionintegration-function)
with THEOplayer by specifying a unique `integrationId`, such as `'custom_wv'` in this example.

```ts
THEOplayer.registerContentProtectionIntegration(
    'custom_wv',
    'widevine',
    new ContentProtectionIntegrations.CustomContentProtectionIntegrationFactory()
);
``` 
The object `ContentProtectionIntegrations` is provided by the library `dist/bundle.js` and gives access to all exports from `src/index.ts`.

When the player now loads a source with an `integration` parameter that matches the `integrationId`
passed during registration, an instance of `CustomContentProtectionIntegration` will be created and used in the DRM flow.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Custom Widevine Test</title>
    <link rel="stylesheet" type="text/css" href="/THEOplayer/ui.css">
    <script src="/THEOplayer/THEOplayer.js"></script>
    <script src="/dist/bundle.js"></script>
</head>
<body>
<div id="THEOplayer" class="theoplayer-container video-js theoplayer-skin"></div>
<script type="text/javascript">
    const element = document.querySelector('#THEOplayer');
    const player = new THEOplayer.Player(element, {
        ui: {
            fluid: true
        },
        libraryLocation: '/THEOplayer/',
    });

    // Register custom content protection integration
    THEOplayer.registerContentProtectionIntegration(
        'custom_wv',
        'widevine',
        new ContentProtectionIntegrations.CustomContentProtectionIntegrationFactory()
    );

    player.source = {
        sources: [
            {
                src: 'insert manifest url here',
                contentProtection: {
                    widevine: {
                        licenseAcquisitionURL: 'insert license url here'
                    },
                    integration: 'custom_wv',
                    integrationParameters: {
                        token: 'insert token here'
                    },
                    preferredKeySystems: ['widevine', 'playready', 'fairplay']
                }
            }
        ],
    };
</script>
</body>
</html>
``` 

### Available examples

- Vualto VuDRM
- EZDRM (only for Fairplay, as Widevine and PlayReady can use the default implementation) 
- Microsoft Azure DRM
- Axinom DRM
- Irdeto Control
- Nagra DRM
- BuyDRM KeyOS
- Comcast DRM
- Verimatrix MultiDRM Core DRM 

### Testing an integration

- Include a THEOplayer build in the root folder under `THEOplayer/`. It should contain the THEOplayer javascript
library `THEOplayer.js`, the declaration file `THEOplayer.d.ts` with all exported TypeScript types, and `ui.css`.
- Run `npm install && npm run build` in the root folder to create the integrations library `bundle.js` under `dist/`.
- Start http-server in the root folder by running `npm run server`.
- Go to `localhost:8080/test/[integration you want to test]`.
