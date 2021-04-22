import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource
} from 'THEOplayer';
import { KeyOSDrmConfiguration } from './KeyOSDrmConfiguration';
import { isKeyOSDrmDRMConfiguration } from "./KeyOSDrmUtils";

export class KeyOSDrmWidevineContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: KeyOSDrmConfiguration;

    constructor(configuration: KeyOSDrmConfiguration) {
        if (!isKeyOSDrmDRMConfiguration(configuration)) {
            throw new Error('The KeyOS token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL) {
            throw new Error('The Widevine KeyOS license url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL;
        request.headers = {
            ...request.headers,
            'x-dt-auth-token': this.contentProtectionConfiguration.integrationParameters.token
        };
        return request;
    }
}
