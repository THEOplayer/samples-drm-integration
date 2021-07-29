import {
    BufferSource, CertificateRequest,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync
} from 'THEOplayer';
import { CastLabsDrmConfiguration } from './CastLabsDrmConfiguration';

export class CastLabsDrmFairPlayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: CastLabsDrmConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: CastLabsDrmConfiguration) {
        console.log("created");
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        console.log("cert request");
        const token = btoa(
            JSON.stringify({
                userId: this.contentProtectionConfiguration.integrationParameters.userId,
                sessionId: this.contentProtectionConfiguration.integrationParameters.sessionId,
                merchant: this.contentProtectionConfiguration.integrationParameters.merchant
            })
        );
        return {
            ...request,
            headers: {
                'dt-custom-data': token
            }
        };
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        let spc;
        console.log("license request");
        if (request && request.body) {
            // const decoder = new TextDecoder('utf8');
            // console.log("decoder", decoder);
            // const decoded = decoder.decode(request.body);
            // console.log("decoded", decoded);
            // spc = btoa(decoded);
            // @ts-ignore
            spc = btoa(String.fromCharCode.apply(null, request.body));
        }
        //
        // console.log("test");
        console.log("spc", spc);
        // @ts-ignore
        const spcMessage = encodeURIComponent(spc)
        var body;
        if (this.contentId != null) {
            body = `spc=${spcMessage}${btoa(encodeURI("&"+this.contentId))}`;
        }
        const requestObj = {
            ...request,
            headers: {
                ...request.headers,
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: body
        }
        console.log("body", requestObj);
        // @ts-ignore
        return requestObj;

    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        console.log("license response");
        const responseAsText = new TextDecoder().decode(response.body);
        const responseObject = JSON.parse(responseAsText);
        return Uint8Array.from(atob(responseObject.getFairplayLicenseResponse.ckcResponse), c => c.charCodeAt(0)).buffer;
    }

    extractFairplayContentId(skdUrl: string): string {
        const extractContentId = function(skdUrl: string): string {
            const questionMarkIndex = skdUrl.indexOf('?');
            if (questionMarkIndex >= 0) {
                return skdUrl.substr(questionMarkIndex + 1);
            } else {
                const chunks = skdUrl.split('/');
                return chunks[chunks.length - 1];
            }
        }
        this.contentId = extractContentId(skdUrl).split("=")[1];
        console.log("contentId", this.contentId);
        return this.contentId;
    }
}
