import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource,
    CertificateRequest, utils, LicenseResponse
} from 'THEOplayer';
import { KeyOSDrmConfiguration } from './KeyOSDrmConfiguration';
import { isKeyOSDrmDRMConfiguration } from "./KeyOSDrmUtils";
import {extractContentId, unwrapCkc} from "../../utils/FairplayUtils";

export class KeyOSDrmFairplayContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: KeyOSDrmConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: KeyOSDrmConfiguration) {
        if (!isKeyOSDrmDRMConfiguration(configuration)) {
            throw new Error('The KeyOS token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.certificateURL) {
            throw new Error('The KeyOS certificate url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.fairplay?.certificateURL;
        request.headers = {
            ...request.headers,
            'x-dt-auth-token': this.contentProtectionConfiguration.integrationParameters.token
        };
        return request;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL) {
            throw new Error('The KeyOS Fairplay license url has not been correctly configured.');
        }

        request.url = this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL;
        request.headers = {
            ...request.headers,
            'x-dt-auth-token': this.contentProtectionConfiguration.integrationParameters.token
        };
        const licenseParameters = `spc=${encodeURIComponent(utils.base64.encode(new Uint8Array(request.body!)))}&assetId=${encodeURIComponent(this.contentId!)}`;
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
