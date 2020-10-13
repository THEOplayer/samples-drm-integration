import { utils } from "THEOplayer";

export function extractContentId(skdUrl: string): string {
    const questionMarkIndex = skdUrl.indexOf('?');
    if (questionMarkIndex >= 0) {
        return skdUrl.substr(questionMarkIndex + 1);
    } else {
        const chunks = skdUrl.split('/');
        return chunks[chunks.length - 1];
    }
}

export function unwrapCkc(data: Uint8Array): Uint8Array {
    let license = new TextDecoder().decode(data).trim();
    if ('<ckc>' === license.substr(0, 5) && '</ckc>' === license.substr(-6)) {
        license = license.slice(5, -6);
    }
    return utils.base64.decode(license);
}
