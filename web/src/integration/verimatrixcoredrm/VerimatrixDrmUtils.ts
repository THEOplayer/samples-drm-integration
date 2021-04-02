import { VerimatrixDrmConfiguration } from './VerimatrixDrmConfiguration';

export function isVerimatrixDrmDRMConfiguration(configuration: VerimatrixDrmConfiguration): boolean {
    return (configuration.integrationParameters.token !== undefined);
}