import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource, utils, LicenseResponse, CertificateRequest, CertificateResponse
} from 'THEOplayer';
import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';
import { isComcastDrmDRMConfiguration } from './ComcastDrmUtils';

export class ComcastDrmWidevineContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: ComcastDrmConfiguration;

    constructor(configuration: ComcastDrmConfiguration) {
        if(!isComcastDrmDRMConfiguration(configuration)){
            throw new Error('The Widevine AzureDRM token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        const { token, account, releasePid } = this.contentProtectionConfiguration.integrationParameters;
        let widevineChallenge = utils.base64.encode(new Uint8Array(request.body!));
        let body = {
            "getWidevineLicense": {
                "releasePid": releasePid,
                "widevineChallenge": widevineChallenge
            }
        };
        return {
            ...request,
            url: request.url + `&token=${token}&account=${account}`,
            body: new TextEncoder().encode(JSON.stringify(body))
        };
    }

    onCertificateResponse(response: CertificateResponse): MaybeAsync<BufferSource> {
        const responseAsText = new TextDecoder().decode(response.body);
        const responseObject = JSON.parse(responseAsText);
        return Uint8Array.from(atob(responseObject.getWidevineLicenseResponse.license), c => c.charCodeAt(0)).buffer;

    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL) {
            throw new Error('The Widevine AzureDRM license url has not been correctly configured.');
        }
        const { token, account, releasePid } = this.contentProtectionConfiguration.integrationParameters;
        let widevineChallenge = utils.base64.encode(new Uint8Array(request.body!));
        let body = {
            "getWidevineLicense": {
                "releasePid": releasePid,
                "widevineChallenge": widevineChallenge
            }
        };
        return {
            ...request,
            url: request.url + `&token=${token}&account=${account}`,
            body: new TextEncoder().encode(JSON.stringify(body))
        };
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        const responseAsText = new TextDecoder().decode(response.body);
        const responseObject = JSON.parse(responseAsText);
        return Uint8Array.from(atob(responseObject.getWidevineLicenseResponse.license), c => c.charCodeAt(0)).buffer;
    }

}
