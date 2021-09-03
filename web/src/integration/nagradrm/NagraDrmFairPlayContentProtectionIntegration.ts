import {
    ContentProtectionIntegration,
    LicenseRequest,
    LicenseResponse,
    MaybeAsync,
    BufferSource,
    CertificateRequest
} from 'THEOplayer';
import { NagraDrmConfiguration } from "./NagraDrmConfiguration";
import { isNagraDrmDRMConfiguration } from "./NagraDrmUtils";
import { fromUint8ArrayToString } from "../../utils/TypeUtils";

export class NagraDrmFairPlayContentProtectionIntegration
    implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: NagraDrmConfiguration;
    private contentId: string | undefined = undefined;

    constructor(configuration: NagraDrmConfiguration) {
        if (!isNagraDrmDRMConfiguration(configuration)) {
            throw new Error("The Nagra token has not been correctly configured.");
        }
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(
        request: CertificateRequest
    ): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.certificateURL) {
            throw new Error(
                "The Nagra certificate url has not been correctly configured."
            );
        }
        request.url = this.contentProtectionConfiguration.fairplay?.certificateURL;
        request.headers = {
            ...request.headers,
            "nv-authorizations": this.contentProtectionConfiguration
                .integrationParameters.token,
            "content-type": "application/octet-stream"
        };
        return request;
    }

    onLicenseRequest(
        request: LicenseRequest
    ): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL) {
            throw new Error(
                "The Nagra Fairplay license url has not been correctly configured."
            );
        }
        request.url = this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL;
        request.headers = {
            ...request.headers,
            "nv-authorizations": this.contentProtectionConfiguration
                .integrationParameters.token,
            "nv-tenant-id": this.contentProtectionConfiguration.integrationParameters
                .tenantId,
            "content-type": "application/octet-stream"
        };
        return request;
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        var responseAsText = fromUint8ArrayToString(response.body);
        var responseCkcMessage = JSON.parse(responseAsText)["CkcMessage"];
        var raw = window.atob(responseCkcMessage);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for (var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    extractFairplayContentId(skdUrl: string): string {
        this.contentId = window.atob(skdUrl.split("skd://")[1].split("?")[0]);
        return this.contentId;
    }
}
