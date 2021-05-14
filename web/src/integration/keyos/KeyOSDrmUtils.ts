import { KeyOSDrmConfiguration } from "./KeyOSDrmConfiguration";

export function isKeyOSDrmDRMConfiguration(configuration: KeyOSDrmConfiguration): boolean {
    return configuration.integrationParameters.customdata !== undefined;
}

export function extractContentId(skdUrl: string): string {
    if (skdUrl.indexOf("skd") > 0 || skdUrl.indexOf("http") > 0) {
        skdUrl = skdUrl.substring(1);
    }
    var link = document.createElement('a');
    link.href = skdUrl;
    return link.hostname;
}