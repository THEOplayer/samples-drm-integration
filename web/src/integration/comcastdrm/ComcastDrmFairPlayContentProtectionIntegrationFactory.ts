import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';
import { ComcastDrmFairPlayContentProtectionIntegration } from './ComcastDrmFairPlayContentProtectionIntegration';

export class ComcastDrmFairPlayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: ComcastDrmConfiguration): ContentProtectionIntegration {
        return new ComcastDrmFairPlayContentProtectionIntegration(configuration);
    }
}
