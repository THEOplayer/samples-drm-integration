import { CastLabsDrmConfiguration } from './CastLabsDrmConfiguration';

export function isDCastLabsDrmDRMConfiguration(configuration: CastLabsDrmConfiguration): boolean {
    return (configuration.integrationParameters.merchant !== undefined &&
        configuration.integrationParameters.sessionId !== undefined &&
        configuration.integrationParameters.userId !== undefined);
}