import {
    BufferSource,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync,
} from 'THEOplayer';
import { VerimatrixMultiDRMStandardConfiguration } from './VerimatrixMultiDRMStandardConfiguration';
import {
    fromBase64StringToArrayBuffer,
    fromBase64StringToString,
    fromObjectToUint8Array, fromStringToUint8Array,
    fromUint8ArrayToBase64String, fromUint8ArrayToObject,
    fromUint8ArrayToString
} from '../../utils/TypeUtils';
import { extractContentId } from '../../utils/FairplayUtils';

export class VerimatrixMultiDRMStandardFairPlayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: VerimatrixMultiDRMStandardConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: VerimatrixMultiDRMStandardConfiguration) {
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        let spcMessage = fromUint8ArrayToBase64String(request.body!);
        let url = this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL;
        if (!this.contentId) {
            throw new Error('The FairPlay Verimatrix Multi-DRM Standard content ID has not been correctly configured.');
        }
        const licenseParameters = `spc=${encodeURIComponent(spcMessage)}&assetId=${encodeURIComponent(this.contentId)}`;
        let newBody = fromStringToUint8Array(licenseParameters);
        const newRequest = {
            ...request,
            url: url,
            body: newBody
        };
        return newRequest;
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        const responseObject = fromUint8ArrayToObject(response.body);
        return fromBase64StringToArrayBuffer(responseObject.ckc);
    }

    extractFairplayContentId(skdUrl: string): string {
        this.contentId = extractContentId(skdUrl);
        return this.contentId;
    }

}
