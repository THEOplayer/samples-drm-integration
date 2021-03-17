import {
    BufferSource,
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync,
    utils
} from 'THEOplayer';
import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';
import { isComcastDrmDRMConfiguration } from './ComcastDrmUtils';
import { extractContentId } from '../../utils/FairplayUtils';

export class ComcastDrmFairPlayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: ComcastDrmConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: ComcastDrmConfiguration) {
        if (!isComcastDrmDRMConfiguration(configuration)) {
            throw new Error('The FairPlay ComcastDRM configuration is incorrect.' +
                'Please verify that you have configured a token, releasePid and accountId.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL) {
            throw new Error('The FairPlay ComcastDRM license url has not been correctly configured.');
        }
        const { token, accountId, releasePid } = this.contentProtectionConfiguration.integrationParameters;
        let spcMessage = utils.base64.encode(new Uint8Array(request.body!));
        let body = {
            "getFairplayLicense": {
                "releasePid": releasePid,
                "spcMessage": spcMessage
            }
        };

        let newBody = new TextEncoder().encode(JSON.stringify(body));
        return {
            ...request,
            url: request.url + `&token=${token}&account=${accountId}&form=json`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: newBody
        };

    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        const responseAsText = new TextDecoder().decode(response.body);
        const responseObject = JSON.parse(responseAsText);
        return Uint8Array.from(atob(responseObject.getFairplayLicenseResponse.ckcResponse), c => c.charCodeAt(0)).buffer;
    }

    extractFairplayContentId(skdUrl: string): string {
        const modifiedContentId = skdUrl.replace('FairPlay', this.contentProtectionConfiguration.integrationParameters.releasePid);
        this.contentId = extractContentId(modifiedContentId);
        return this.contentId;
    }
}
