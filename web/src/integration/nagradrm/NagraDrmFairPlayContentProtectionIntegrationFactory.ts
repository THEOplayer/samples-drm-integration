import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { NagraDrmConfiguration } from "./NagraDrmConfiguration";
import { NagraDrmFairPlayContentProtectionIntegration } from "./NagraDrmFairPlayContentProtectionIntegration";

export class NagraDrmFairPlayContentProtectionIntegrationFactory
    implements ContentProtectionIntegrationFactory {
    build(configuration: NagraDrmConfiguration): ContentProtectionIntegration {
        return new NagraDrmFairPlayContentProtectionIntegration(configuration);
    }
}
