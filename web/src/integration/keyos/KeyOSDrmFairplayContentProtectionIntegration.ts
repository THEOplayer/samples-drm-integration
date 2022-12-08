import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource,
    CertificateRequest, LicenseResponse
} from 'THEOplayer';
import { KeyOSDrmConfiguration } from './KeyOSDrmConfiguration';
import { isKeyOSDrmDRMConfiguration, extractContentId } from "./KeyOSDrmUtils";
import {
    fromBase64StringToUint8Array, fromStringToUint8Array,
    fromUint8ArrayToBase64String,
    fromUint8ArrayToUtf8String
} from "../../utils/TypeUtils";


export class KeyOSDrmFairplayContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: KeyOSDrmConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: KeyOSDrmConfiguration) {
        if (!isKeyOSDrmDRMConfiguration(configuration)) {
            throw new Error('The KeyOS customdata value has not been correctly configured.');
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
            'x-keyos-authorization': this.contentProtectionConfiguration.integrationParameters['x-keyos-authorization']
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
            'x-keyos-authorization': this.contentProtectionConfiguration.integrationParameters['x-keyos-authorization']
        };
        const licenseParameters = `spc=${fromUint8ArrayToBase64String(request.body!)}&assetId=${this.contentId}`;
        request.body = fromStringToUint8Array(licenseParameters);
        return request;
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        const bodyAsString = fromUint8ArrayToUtf8String(response.body)
        let keyText = bodyAsString.trim()
        if (keyText.substr(0, 5) === '<ckc>' && keyText.substr(-6) === '</ckc>') {
            keyText = keyText.slice(5, -6)
        }
        return fromBase64StringToUint8Array(keyText)
    }

    extractFairplayContentId(skdUrl: string): string {
        this.contentId = extractContentId(skdUrl);
        return this.contentId;
    }
}
