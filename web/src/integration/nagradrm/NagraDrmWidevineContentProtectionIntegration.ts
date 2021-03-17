import {
    ContentProtectionIntegration,
    LicenseRequest,
    CertificateRequest,
    MaybeAsync,
    BufferSource
} from 'THEOplayer';
import { NagraDrmConfiguration } from "./NagraDrmConfiguration";
import { isNagraDrmDRMConfiguration } from "./NagraDrmUtils";

export class NagraDrmWidevineContentProtectionIntegration
    implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: NagraDrmConfiguration;

    constructor(configuration: NagraDrmConfiguration) {
        if (!isNagraDrmDRMConfiguration(configuration)) {
            throw new Error("The Nagra token has not been correctly configured.");
        }
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(
        request: CertificateRequest
    ): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        request.headers = {
            ...request.headers,
            "nv-authorizations": this.contentProtectionConfiguration
                .integrationParameters.token,
            "Content-Type": "application/octet-stream"
        };
        return request;
    }

    onLicenseRequest(
        request: LicenseRequest
    ): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        if (!this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL) {
            throw new Error(
                "The Widevine Nagra license url has not been correctly configured."
            );
        }
        request.url = this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL;
        request.headers = {
            ...request.headers,
            "nv-authorizations": this.contentProtectionConfiguration
                .integrationParameters.token
        };
        return request;
    }
}
