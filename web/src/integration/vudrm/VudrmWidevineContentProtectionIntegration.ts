import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource, CertificateRequest
} from 'THEOplayer';
import { VudrmDrmConfiguration } from './VudrmDrmConfiguration';
import { isVudrmDRMConfiguration } from './VudrmUtil';

export class VudrmWidevineContentProtectionIntegration implements ContentProtectionIntegration {

    static readonly DEFAULT_LICENSE_URL = 'https://widevine-proxy.drm.technology/proxy';

    private readonly contentProtectionConfiguration: VudrmDrmConfiguration;

    constructor(configuration: VudrmDrmConfiguration) {
        if (!isVudrmDRMConfiguration(configuration)) {
            throw new Error('The Widevine vuDRM token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    private wrapRequestBody(body: Uint8Array) {
        const token = this.contentProtectionConfiguration.integrationParameters.token;
        const drmInfo = Array.from(new Uint8Array(body));
        const kid = this.contentProtectionConfiguration.integrationParameters.keyId;
        return new TextEncoder().encode((JSON.stringify({ token, drm_info: drmInfo, kid })));
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        request.url = this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL ??
            VudrmWidevineContentProtectionIntegration.DEFAULT_LICENSE_URL;
        request.body = this.wrapRequestBody(request.body!);
        return request;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        request.url = this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL ??
            VudrmWidevineContentProtectionIntegration.DEFAULT_LICENSE_URL;
        request.body = this.wrapRequestBody(request.body!);
        return request;
    }
}
