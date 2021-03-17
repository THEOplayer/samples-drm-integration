import { NagraDrmConfiguration } from "./NagraDrmConfiguration";

export function isNagraDrmDRMConfiguration(
    configuration: NagraDrmConfiguration
): boolean {
    return configuration.integrationParameters.token !== undefined;
}
