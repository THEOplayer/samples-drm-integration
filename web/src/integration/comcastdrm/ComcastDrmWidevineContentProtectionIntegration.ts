import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource, LicenseResponse, CertificateRequest, CertificateResponse
} from 'THEOplayer';
import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';
import { isComcastDrmDRMConfiguration } from './ComcastDrmUtils';
import { fromObjectToUint8Array, fromUint8ArrayToBase64String, fromUint8ArrayToString } from "../../utils/TypeUtils";

export class ComcastDrmWidevineContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: ComcastDrmConfiguration;

    constructor(configuration: ComcastDrmConfiguration) {
        if (!isComcastDrmDRMConfiguration(configuration)) {
            throw new Error('The Widevine AzureDRM token has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        const {token, account, releasePid} = this.contentProtectionConfiguration.integrationParameters;
        const widevineChallenge = fromUint8ArrayToBase64String(request.body!);
        const body = {
            "getWidevineLicense": {
                "releasePid": releasePid,
                "widevineChallenge": widevineChallenge
            }
        };
        return {
            ...request,
            url: request.url + `&token=${token}&account=${account}`,
            body: fromObjectToUint8Array(body)
        };
    }

    onCertificateResponse(response: CertificateResponse): MaybeAsync<BufferSource> {
        const responseAsText = fromUint8ArrayToString(response.body);
        const responseObject = JSON.parse(responseAsText);
        return Uint8Array.from(atob(responseObject.getWidevineLicenseResponse.license), c => c.charCodeAt(0)).buffer;

    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL) {
            throw new Error('The Widevine AzureDRM license url has not been correctly configured.');
        }
        const {token, account, releasePid} = this.contentProtectionConfiguration.integrationParameters;
        const widevineChallenge = fromUint8ArrayToBase64String(request.body!);
        const body = {
            "getWidevineLicense": {
                "releasePid": releasePid,
                "widevineChallenge": widevineChallenge
            }
        };
        return {
            ...request,
            url: request.url + `&token=${token}&account=${account}`,
            body: fromObjectToUint8Array(body)
        };
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        const responseAsText = fromUint8ArrayToString(response.body);
        const responseObject = JSON.parse(responseAsText);
        return Uint8Array.from(atob(responseObject.getWidevineLicenseResponse.license), c => c.charCodeAt(0)).buffer;
    }

}
