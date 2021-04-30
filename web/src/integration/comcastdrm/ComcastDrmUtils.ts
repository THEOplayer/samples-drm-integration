import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';

export function isComcastDrmDRMConfiguration(configuration: ComcastDrmConfiguration): boolean {
    return (configuration.integrationParameters.token !== undefined &&
        configuration.integrationParameters.releasePid !== undefined &&
        configuration.integrationParameters.account !== undefined);
}