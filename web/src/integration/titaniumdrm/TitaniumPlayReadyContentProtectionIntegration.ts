import { isTitaniumDRMConfiguration } from './TitaniumUtils';
import { createTitaniumHeaders, TitaniumCDMType } from './TitaniumBaseRegistration';
import type { BufferSource, ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'THEOplayer';
import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import { CertificateRequest } from 'THEOplayer';

export class TitaniumPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: TitaniumDrmConfiguration;

    constructor(drmConfiguration: TitaniumDrmConfiguration) {
        if (!isTitaniumDRMConfiguration(drmConfiguration)) {
            throw new Error('Titanium DRM has not been correctly configured.');
        }
        this.contentProtectionConfiguration = drmConfiguration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        request.headers = {
            ...request.headers,
            ...createTitaniumHeaders(this.contentProtectionConfiguration, TitaniumCDMType.WIDEVINE),
        };
        return request;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        request.headers = {
            ...request.headers,
            ...createTitaniumHeaders(this.contentProtectionConfiguration, TitaniumCDMType.WIDEVINE),
        };
        return request;
    }
}
