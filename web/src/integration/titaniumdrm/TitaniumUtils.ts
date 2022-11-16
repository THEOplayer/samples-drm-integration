/* eslint-disable no-undef */
import type {
    DeviceBasedTitaniumIntegrationParameters,
    TitaniumIntegrationParameters,
    TokenBasedTitaniumIntegrationParameters,
} from './TitaniumIntegrationParameters';
import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';

export function isTitaniumDRMConfiguration(configuration: TitaniumDrmConfiguration): boolean {
    const integrationParameters = configuration.integrationParameters;
    return isTokenBasedTitaniumDRMConfiguration(integrationParameters) || isDeviceBasedTitaniumDRMConfiguration(integrationParameters);
}

export function isTokenBasedTitaniumDRMConfiguration(
    integrationParameters: TitaniumIntegrationParameters,
): integrationParameters is TokenBasedTitaniumIntegrationParameters {
    return integrationParameters.authToken !== undefined;
}

export function isDeviceBasedTitaniumDRMConfiguration(
    integrationParameters: TitaniumIntegrationParameters,
): integrationParameters is DeviceBasedTitaniumIntegrationParameters {
    return (
        integrationParameters.accountName !== undefined &&
        integrationParameters.customerName !== undefined &&
        integrationParameters.portalId !== undefined
    );
}
