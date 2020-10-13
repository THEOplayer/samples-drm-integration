import { AxinomDrmConfiguration } from "./AxinomDrmConfiguration";

export function isAxinomDrmDRMConfiguration(configuration: AxinomDrmConfiguration): boolean {
    return configuration.integrationParameters.token !== undefined;
}
