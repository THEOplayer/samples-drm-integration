import { BufferSource, ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'THEOplayer';
import { isTitaniumDRMConfiguration } from './TitaniumUtils';
import { TitaniumDrmIntegrationConfiguration } from './TitaniumDrmIntegrationConfiguration';
import { createTitaniumCDataHeader, TitaniumCDMType } from './TitaniumBaseRegistration';

export class TitaniumPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: TitaniumDrmIntegrationConfiguration;

    constructor(drmConfiguration: TitaniumDrmIntegrationConfiguration) {
        if (!isTitaniumDRMConfiguration(drmConfiguration.integrationParameters)) {
            throw new Error('The PlayReady Titanium authToken has not been correctly configured.');
        }
        this.contentProtectionConfiguration = drmConfiguration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        const { version } = this.contentProtectionConfiguration.integrationParameters;
        const cdmType = version === '2' ? TitaniumCDMType.PLAYREADY_v2 : TitaniumCDMType.PLAYREADY_v3;
        request.headers = {
            ...request.headers,
            'Content-Type': 'text/xml; charset=utf-8',
            'X-TITANIUM-DRM-CDATA': createTitaniumCDataHeader(this.contentProtectionConfiguration.integrationParameters, cdmType)
        }
        return request;
    }
}
