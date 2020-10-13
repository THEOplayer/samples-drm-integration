import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource,
    CertificateRequest, utils
} from 'THEOplayer';
import { VudrmDrmConfiguration } from './VudrmDrmConfiguration';
import { isVudrmDRMConfiguration } from './VudrmUtil';
import { extractContentId } from '../../utils/FairplayUtils';

export class VudrmFairplayContentProtectionIntegration implements ContentProtectionIntegration {

    static readonly DEFAULT_CERTIFICATE_URL = 'https://fairplay-license.drm.technology/certificate';
    static readonly DEFAULT_LICENSE_URL = 'https://fairplay-license.drm.technology/license';

    private readonly contentProtectionConfiguration: VudrmDrmConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: VudrmDrmConfiguration) {
        if (!isVudrmDRMConfiguration(configuration)) {
            throw new Error('The FairPlay vuDRM token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        request.url = this.contentProtectionConfiguration.fairplay?.certificateURL ??
            VudrmFairplayContentProtectionIntegration.DEFAULT_CERTIFICATE_URL;
        request.headers = {
            ...request.headers,
            'Content-Type': 'application/json',
            'x-vudrm-token': this.contentProtectionConfiguration.integrationParameters.token
        };
        return request;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        request.url = this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL ??
            VudrmFairplayContentProtectionIntegration.DEFAULT_LICENSE_URL;
        const licenseParameters = {
            token: this.contentProtectionConfiguration.integrationParameters.token,
            contentId: this.contentId,
            payload: utils.base64.encode(new Uint8Array(request.body!))
        };
        request.headers = {
            'Content-Type': 'application/json',
            'x-vudrm-token': this.contentProtectionConfiguration.integrationParameters.token
        }
        request.body = new TextEncoder().encode((JSON.stringify(licenseParameters)));
        return request;
    }

    extractFairplayContentId(skdUrl: string): string {
        this.contentId = extractContentId(skdUrl);
        return this.contentId;
    }
}
