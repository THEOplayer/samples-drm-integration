import {
    BufferSource,
    ContentProtectionIntegration,
    CertificateRequest,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync
} from 'THEOplayer';
import { IrdetoControlConfiguration } from './IrdetoControlConfiguration';

export class IrdetoControlFairplayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: IrdetoControlConfiguration;
    private contentId: string | undefined = undefined;
    private keyId: string | undefined = undefined;

    constructor(configuration: IrdetoControlConfiguration) {
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.certificateURL) {
            throw new Error('The FairPlay Irdeto Control certificate url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.fairplay?.certificateURL;
        if (!this.hasQueryParameter(request.url, "applicationId") && this.contentProtectionConfiguration.integrationParameters?.applicationId) {
            request.url = this.appendQueryParameter(request.url, "applicationId", this.contentProtectionConfiguration.integrationParameters?.applicationId);
        }
        return request;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL) {
            throw new Error('The FairPlay Irdeto DRM license url has not been correctly configured.');
        }
        request.url = this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL;
        if (!this.hasQueryParameter(request.url, "contentId")) {
            if (this.contentProtectionConfiguration.integrationParameters?.contentId) {
                request.url = this.appendQueryParameter(request.url, "contentId", this.contentProtectionConfiguration.integrationParameters?.contentId);
            } else if (this.contentId) {
                request.url = this.appendQueryParameter(request.url, "contentId", this.contentId);
            }
        }
        if (!this.hasQueryParameter(request.url, "keyId")) {
            if (this.contentProtectionConfiguration.integrationParameters?.keyId) {
                request.url = this.appendQueryParameter(request.url, "keyId", this.contentProtectionConfiguration.integrationParameters?.keyId);
            } else if (this.keyId) {
                request.url = this.appendQueryParameter(request.url, "keyId", this.keyId);
            }
        }
        return request;
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        return response.body;
    }

    extractFairplayContentId(skdUrl: string): string {
        const parameters = skdUrl.split("?")[1].split("&");
        for (let i = 0; i < parameters.length; i++) {
            const pair = parameters[i].split("=");
            if (pair[0] == "contentId") {
                this.contentId = pair[1];
            } else if (pair[0] == "keyId") {
                this.keyId = pair[1];
            }
        }
        return skdUrl;
    }

    hasQueryParameter(url: string, parameter: string): boolean {
        const queryParameters = url.split("?");
        if (!queryParameters || !queryParameters[1]) {
            return false;
        }
        const pairs = queryParameters[1].split("&");
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split("=");
            if (pair[0] == parameter) {
                return true;
            }
        }
        return false;
    }

    appendQueryParameter(url: string, key: string, value: string | undefined): string {
        const queryParameters = url.split("?");
        if (!queryParameters || !queryParameters[1]) {
            return (url + "?" + key + "=" + value);
        } else {
            return (url + "&" + key + "=" + value);
        }
    }
}
