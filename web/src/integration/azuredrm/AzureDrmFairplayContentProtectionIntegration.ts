import {
    BufferSource,
    CertificateRequest,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync,
} from 'THEOplayer';
import { AzureDrmConfiguration } from './AzureDrmConfiguration';
import { isAzureDrmDRMConfiguration } from './AzureDrmUtils';
import { extractContentId, unwrapCkc } from '../../utils/FairplayUtils';
import { fromStringToUint8Array, fromUint8ArrayToBase64String } from "../../utils/TypeUtils";

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
        const licenseParameters = `spc=${encodeURIComponent(fromUint8ArrayToBase64String(request.body!))}&assetId=${encodeURIComponent(this.contentId)}`;
        request.body = fromStringToUint8Array(licenseParameters);
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
