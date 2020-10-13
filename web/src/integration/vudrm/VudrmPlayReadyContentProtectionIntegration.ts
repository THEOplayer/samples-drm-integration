import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource
} from 'THEOplayer';
import { isVudrmDRMConfiguration } from './VudrmUtil';
import { VudrmDrmConfiguration } from "./VudrmDrmConfiguration";

export class VudrmPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {

    static DEFAULT_LICENSE_URL = 'https://playready-license.drm.technology/rightsmanager.asmx';

    private readonly contentProtectionConfiguration: VudrmDrmConfiguration;

    constructor(drmConfiguration: VudrmDrmConfiguration) {
        if (!isVudrmDRMConfiguration(drmConfiguration)) {
            throw new Error('The PlayReady vuDRM token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = drmConfiguration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        const url = new URL(this.contentProtectionConfiguration.playready?.licenseAcquisitionURL ??
            VudrmPlayReadyContentProtectionIntegration.DEFAULT_LICENSE_URL);
        if (this.contentProtectionConfiguration.playready?.queryParameters) {
            for (const key of Object.keys(this.contentProtectionConfiguration.playready.queryParameters)) {
                url.searchParams.set(key, this.contentProtectionConfiguration.playready.queryParameters[key]);
            }
        }
        url.searchParams.set('token', this.contentProtectionConfiguration.integrationParameters.token);
        request.url = url.toString();
        return request;
    }
}
