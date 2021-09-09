import {
    BufferSource, CertificateRequest,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync
} from 'THEOplayer';
import { CastLabsDrmConfiguration } from './CastLabsDrmConfiguration';
import { unwrapCkc } from '../../utils/FairplayUtils';
import { fromObjectToBase64String, fromStringToUint8Array, fromUint8ArrayToBase64String } from "../../utils/TypeUtils";

export class CastLabsDrmFairPlayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: CastLabsDrmConfiguration;
    private contentId: string | undefined = undefined;
    private generatedToken: string;

    constructor(configuration: CastLabsDrmConfiguration) {
        this.contentProtectionConfiguration = configuration;
        const jsonObj = {
            userId: this.contentProtectionConfiguration.integrationParameters.userId,
            sessionId: this.contentProtectionConfiguration.integrationParameters.sessionId,
            merchant: this.contentProtectionConfiguration.integrationParameters.merchant
        };
        this.generatedToken = fromObjectToBase64String(jsonObj);
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        request.headers = {
            ...request.headers,
            'dt-custom-data': this.generatedToken!
        };
        return request
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        request.headers = {
            ...request.headers,
            'content-type': 'application/x-www-form-urlencoded',
            'dt-custom-data': this.generatedToken!,
        };
        const body = `spc=${encodeURIComponent(fromUint8ArrayToBase64String(request.body!))}&${encodeURIComponent(this.contentId!)}`;
        request.body = fromStringToUint8Array(body);
        return request;
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        return unwrapCkc(response.body);
    }

    extractFairplayContentId(skdUrl: string): string {
        this.contentId = skdUrl
        return this.contentId;
    }
}
