import {
    BufferSource, CertificateRequest,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    utils,
    MaybeAsync
} from 'THEOplayer';
import { CastLabsDrmConfiguration } from './CastLabsDrmConfiguration';
import { unwrapCkc } from '../../utils/FairplayUtils';


export class CastLabsDrmFairPlayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: CastLabsDrmConfiguration;
    private contentId: string | undefined = undefined;
    private generatedToken: string;

    constructor(configuration: CastLabsDrmConfiguration) {
        console.log("created");
        this.contentProtectionConfiguration = configuration;
        this.generatedToken = btoa(
            JSON.stringify({
                userId: this.contentProtectionConfiguration.integrationParameters.userId,
                sessionId: this.contentProtectionConfiguration.integrationParameters.sessionId,
                merchant: this.contentProtectionConfiguration.integrationParameters.merchant
            })
        );
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        console.log("cert request");
        
        request.headers = {
            ...request.headers,
            'dt-custom-data': this.generatedToken!
        };
        return request
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        console.log("license request");

        request.headers = {
            ...request.headers,
            'content-type': 'application/x-www-form-urlencoded',
            'dt-custom-data': this.generatedToken!,
        };

        const body = `spc=${encodeURIComponent(utils.base64.encode(new Uint8Array(request.body!)))}&${encodeURIComponent(this.contentId!)}`;
        request.body = new TextEncoder().encode(body);

        return request;

    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        return unwrapCkc(response.body);
    }


    extractFairplayContentId(skdUrl: string): string {
        this.contentId = skdUrl
        console.log("contentId", this.contentId);
        return this.contentId;
    }
}
