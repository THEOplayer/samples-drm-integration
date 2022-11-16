import {
    BufferSource,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync,
} from 'THEOplayer';
import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';
import { isComcastDrmDRMConfiguration } from './ComcastDrmUtils';
import { extractContentId } from '../../utils/FairplayUtils';
import {
    fromBase64StringToArrayBuffer,
    fromBase64StringToString,
    fromObjectToUint8Array,
    fromUint8ArrayToBase64String,
    fromUint8ArrayToObject,
} from "../../utils/TypeUtils";

export class ComcastDrmFairPlayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: ComcastDrmConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: ComcastDrmConfiguration) {
        if (!isComcastDrmDRMConfiguration(configuration)) {
            throw new Error('The FairPlay ComcastDRM configuration is incorrect.' +
                'Please verify that you have configured a token, releasePid and account.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL) {
            throw new Error('The FairPlay ComcastDRM license url has not been correctly configured.');
        }
        const {token, account, releasePid} = this.contentProtectionConfiguration.integrationParameters;
        const spcMessage = fromUint8ArrayToBase64String(request.body!);
        const body = {
            "getFairplayLicense": {
                "releasePid": releasePid,
                "spcMessage": spcMessage
            }
        };

        const newBody = fromObjectToUint8Array(body);
        return {
            ...request,
            url: request.url + `&token=${token}&account=${account}&form=json`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: newBody
        };

    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        const responseObject = fromUint8ArrayToObject(response.body);
        return fromBase64StringToArrayBuffer(responseObject.getFairplayLicenseResponse.ckcResponse);
    }

    extractFairplayContentId(skdUrl: string): string {
        const modifiedContentId = skdUrl.replace('FairPlay', this.contentProtectionConfiguration.integrationParameters.releasePid);
        this.contentId = extractContentId(modifiedContentId);
        return this.contentId;
    }
}
