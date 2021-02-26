import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource
} from 'THEOplayer';
import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';
import { isComcastDrmDRMConfiguration } from './ComcastDrmUtils';

export class ComcastDrmPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: ComcastDrmConfiguration;

    constructor(configuration: ComcastDrmConfiguration) {
        if(!isComcastDrmDRMConfiguration(configuration)){
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
