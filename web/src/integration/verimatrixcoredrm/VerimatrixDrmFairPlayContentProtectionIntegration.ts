import {
    BufferSource,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync,
    utils
} from 'THEOplayer';
import { VerimatrixDrmConfiguration } from './VerimatrixDrmConfiguration';
import { isVerimatrixDrmDRMConfiguration } from './VerimatrixDrmUtils';
import { extractContentId } from '../../utils/FairplayUtils';

export class VerimatrixDrmFairPlayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: VerimatrixDrmConfiguration;
    private contentId: string | undefined = undefined;

    static readonly DEFAULT_FAIRPLAY_LICENSE_URL = 'https://multidrm.vsaas.verimatrixcloud.net/fairplay';

    constructor(configuration: VerimatrixDrmConfiguration) {
        if (!isVerimatrixDrmDRMConfiguration(configuration)) {
            throw new Error('The FairPlay Verimatrix DRM configuration is incorrect.' +
                'An Authorization token is required.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {

        let spcMessage = utils.base64.encode(new Uint8Array(request.body!));
        let body = {
            "spc": spcMessage
        };

        let newBody = new TextEncoder().encode(JSON.stringify(body));
        return {
            ...request,
            url: this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL ??
                VerimatrixDrmFairPlayContentProtectionIntegration.DEFAULT_FAIRPLAY_LICENSE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.contentProtectionConfiguration.integrationParameters.token
            },
            body: newBody
        };

    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        const responseAsText = new TextDecoder().decode(response.body);
        const responseObject = JSON.parse(responseAsText);
        return Uint8Array.from(atob(responseObject.ckc), c => c.charCodeAt(0)).buffer;
    }

    extractFairplayContentId(skdUrl: string): string {
        this.contentId = extractContentId(skdUrl);
        return this.contentId;
    }
}
