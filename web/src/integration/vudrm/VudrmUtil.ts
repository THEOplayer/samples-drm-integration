import { VudrmDrmConfiguration } from "./VudrmDrmConfiguration";

export function isVudrmDRMConfiguration(configuration: VudrmDrmConfiguration): boolean {
    return configuration.integrationParameters.token !== undefined;
}
