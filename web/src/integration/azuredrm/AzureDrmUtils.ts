import { AzureDrmConfiguration } from './AzureDrmConfiguration';

export function isAzureDrmDRMConfiguration(configuration: AzureDrmConfiguration): boolean {
    return configuration.integrationParameters.token !== undefined;
}