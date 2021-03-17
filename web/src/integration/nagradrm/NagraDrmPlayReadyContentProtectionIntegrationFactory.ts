import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { NagraDrmConfiguration } from "./NagraDrmConfiguration";
import { NagraDrmPlayReadyContentProtectionIntegration } from "./NagraDrmPlayReadyContentProtectionIntegration";

export class NagraDrmPlayReadyContentProtectionIntegrationFactory
    implements ContentProtectionIntegrationFactory {
    build(configuration: NagraDrmConfiguration): ContentProtectionIntegration {
        return new NagraDrmPlayReadyContentProtectionIntegration(configuration);
    }
}
