import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource
} from 'THEOplayer';
import { AzureDrmConfiguration } from './AzureDrmConfiguration';
import { isAzureDrmDRMConfiguration } from './AzureDrmUtils';

export class AzureDrmPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: AzureDrmConfiguration;

    constructor(configuration: AzureDrmConfiguration) {
        if (!isAzureDrmDRMConfiguration(configuration)) {
            throw new Error('The PlayReady AzureDRM token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.playready?.licenseAcquisitionURL) {
            throw new Error('The PlayReady AzureDRM license url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.playready?.licenseAcquisitionURL;
        request.headers = {
            ...request.headers,
            Authorization: `Bearer ${this.contentProtectionConfiguration.integrationParameters.token}`
        };
        return request;
    }
}
