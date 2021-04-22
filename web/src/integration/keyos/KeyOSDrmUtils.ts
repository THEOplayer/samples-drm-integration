import { KeyOSDrmConfiguration } from "./KeyOSDrmConfiguration";

export function isKeyOSDrmDRMConfiguration(configuration: KeyOSDrmConfiguration): boolean {
    return configuration.integrationParameters.token !== undefined;
}
