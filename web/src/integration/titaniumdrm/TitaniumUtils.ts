import { TitaniumDRMConfiguration, DeviceBasedTitaniumDRMConfiguration, TokenBasedTitaniumDRMConfiguration } from 'THEOplayer';

export function isTitaniumDRMConfiguration(configuration: TitaniumDRMConfiguration): boolean {
    return isTokenBasedTitaniumDRMConfiguration(configuration) || isDeviceBasedTitaniumDRMConfiguration((configuration));
}

// eslint-disable-next-line no-undef
export function isTokenBasedTitaniumDRMConfiguration(configuration: TitaniumDRMConfiguration): configuration is TokenBasedTitaniumDRMConfiguration {
    return configuration.authToken !== undefined;
}

// eslint-disable-next-line no-undef
export function isDeviceBasedTitaniumDRMConfiguration(configuration: TitaniumDRMConfiguration): configuration is DeviceBasedTitaniumDRMConfiguration {
    return (
        configuration.accountName !== undefined &&
        configuration.customerName !== undefined &&
        configuration.portalId !== undefined
    );
}
