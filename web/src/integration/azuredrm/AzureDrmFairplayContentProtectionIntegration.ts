import {
    BufferSource,
    CertificateRequest,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync,
    utils
} from 'THEOplayer';
import { AzureDrmConfiguration } from './AzureDrmConfiguration';
import { isAzureDrmDRMConfiguration } from './AzureDrmUtils';
import { extractContentId, unwrapCkc } from '../../utils/FairplayUtils';

export class AzureDrmFairplayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: AzureDrmConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: AzureDrmConfiguration) {
        if (!isAzureDrmDRMConfiguration(configuration)) {
            throw new Error('The FairPlay AzureDRM token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.certificateURL) {
            throw new Error('The FairPlay AzureDRM certificate url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.fairplay?.certificateURL;
        request.headers = {
            ...request.headers,
            Authorization: `Bearer ${this.contentProtectionConfiguration.integrationParameters.token}`
        };
        return request;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL) {
            throw new Error('The FairPlay AzureDRM license url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL;
        request.headers = {
            ...request.headers,
            Authorization: `Bearer ${this.contentProtectionConfiguration.integrationParameters.token}`
        };
        if (!this.contentId) {
            throw new Error('The FairPlay AzureDRM content ID has not been correctly configured.');
        }
        const licenseParameters = `spc=${encodeURIComponent(utils.base64.encode(new Uint8Array(request.body!)))}&assetId=${encodeURIComponent(this.contentId)}`;
        request.body = new TextEncoder().encode(licenseParameters);
        return request;
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        return unwrapCkc(response.body);
    }

    extractFairplayContentId(skdUrl: string): string {
        this.contentId = extractContentId(skdUrl);
        return this.contentId;
    }
}
