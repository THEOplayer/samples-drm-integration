import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource
} from 'THEOplayer';
import { KeyOSDrmConfiguration } from './KeyOSDrmConfiguration';
import { isKeyOSDrmDRMConfiguration } from "./KeyOSDrmUtils";

export class KeyOSDrmPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: KeyOSDrmConfiguration;

    constructor(configuration: KeyOSDrmConfiguration) {
        if (!isKeyOSDrmDRMConfiguration(configuration)) {
            throw new Error('The KeyOS customdata value has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.playready?.licenseAcquisitionURL) {
            throw new Error('The PlayReady KeyOS license url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.playready?.licenseAcquisitionURL;
        request.headers = {
            ...request.headers,
            'customdata': this.contentProtectionConfiguration.integrationParameters.customdata
        };
        return request;
    }
}
