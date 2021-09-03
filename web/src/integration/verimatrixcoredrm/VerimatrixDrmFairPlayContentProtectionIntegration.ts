import {
    BufferSource,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync,
} from 'THEOplayer';
import { VerimatrixDrmConfiguration } from './VerimatrixDrmConfiguration';
import { fromObjectToUint8Array, fromUint8ArrayToBase64String, fromUint8ArrayToString } from '../../utils/TypeUtils';

export class VerimatrixDrmFairPlayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: VerimatrixDrmConfiguration;
    private contentId: string | undefined = undefined;

    static readonly DEFAULT_FAIRPLAY_LICENSE_URL = 'https://multidrm.vsaas.verimatrixcloud.net/fairplay';

    constructor(configuration: VerimatrixDrmConfiguration) {
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        let spcMessage = fromUint8ArrayToBase64String(request.body!);
        let body = {
            "spc": spcMessage
        };
        let newBody = fromObjectToUint8Array(body);
        const newRequest = {
            ...request,
            url: this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL ??
                VerimatrixDrmFairPlayContentProtectionIntegration.DEFAULT_FAIRPLAY_LICENSE_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            body: newBody
        };
        return newRequest;

    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        const responseAsText = fromUint8ArrayToString(response.body);
        const responseObject = JSON.parse(responseAsText);
        return Uint8Array.from(atob(responseObject.ckc), c => c.charCodeAt(0)).buffer;
    }

    extractFairplayContentId(skdUrl: string): string {
        if (skdUrl.indexOf("skd") > 0 || skdUrl.indexOf("http") > 0) {
            skdUrl = skdUrl.substring(1);
        }
        const link = document.createElement('a');
        link.href = skdUrl;
        this.contentId = link.hostname;
        return this.contentId;
    }
}
