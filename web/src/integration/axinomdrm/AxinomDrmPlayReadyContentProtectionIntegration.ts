import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource
} from 'THEOplayer';
import { AxinomDrmConfiguration } from './AxinomDrmConfiguration';
import { isAxinomDrmDRMConfiguration } from "./AxinomDrmUtils";

export class AxinomDrmPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: AxinomDrmConfiguration;

    constructor(configuration: AxinomDrmConfiguration) {
        if (!isAxinomDrmDRMConfiguration(configuration)) {
            throw new Error('The Axinom token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.playready?.licenseAcquisitionURL) {
            throw new Error('The PlayReady Axinom license url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.playready?.licenseAcquisitionURL;
        request.headers = {
            ...request.headers,
            'X-AxDRM-Message': this.contentProtectionConfiguration.integrationParameters.token
        };
        return request;
    }
}
