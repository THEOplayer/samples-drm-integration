import {
    ContentProtectionIntegration,
    LicenseRequest,
    MaybeAsync,
    BufferSource,
    CertificateRequest,
    LicenseResponse
} from 'THEOplayer';
import { TitaniumDrmIntegrationConfiguration } from './TitaniumDrmIntegrationConfiguration';
import { isTitaniumDRMConfiguration } from './TitaniumUtils';
import {
    fromBase64StringToUint8Array,
    fromStringToUint8Array,
    fromUint8ArrayToObject,
} from '../../utils/TypeUtils';
import TitaniumWidevineLicenseResponse from './TitaniumWidevineLicenseResponse';
import {
    createTitaniumCustomData,
    TitaniumCDMType
} from './TitaniumBaseRegistration';

export class TitaniumWidevineContentProtectionIntegration implements ContentProtectionIntegration {

    private readonly contentProtectionConfiguration: TitaniumDrmIntegrationConfiguration;

    constructor(configuration: TitaniumDrmIntegrationConfiguration) {
        if (!isTitaniumDRMConfiguration(configuration.integrationParameters)) {
            throw new Error('The Widevine Titanium authToken has not been correctly configured.');
        }
        this.contentProtectionConfiguration = configuration;
    }

    onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
        const { integrationParameters } = this.contentProtectionConfiguration;
        const customData = createTitaniumCustomData(request.body!, integrationParameters, TitaniumCDMType.WIDEVINE);
        request.body = fromStringToUint8Array(customData);
        return request;
    }

    onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
        const { integrationParameters } = this.contentProtectionConfiguration;
        const customData = createTitaniumCustomData(request.body!, integrationParameters, TitaniumCDMType.WIDEVINE);
        request.body = fromStringToUint8Array(customData);
        return request;
    }

    onLicenseResponse(response: LicenseResponse): MaybeAsync<BufferSource> {
        const responseObject = fromUint8ArrayToObject(response.body) as TitaniumWidevineLicenseResponse;
        return fromBase64StringToUint8Array(responseObject.license);
    }
}
