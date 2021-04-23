import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { KeyOSDrmConfiguration } from "./KeyOSDrmConfiguration";
import { KeyOSDrmPlayReadyContentProtectionIntegration } from "./KeyOSDrmPlayReadyContentProtectionIntegration";

export class KeyOSDrmPlayReadyContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: KeyOSDrmConfiguration): ContentProtectionIntegration {
        return new KeyOSDrmPlayReadyContentProtectionIntegration(configuration);
    }
}
