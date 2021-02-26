import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';
import { ComcastDrmPlayReadyContentProtectionIntegration } from './ComcastDrmPlayReadyContentProtectionIntegration';

export class ComcastDrmPlayReadyContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: ComcastDrmConfiguration): ContentProtectionIntegration {
        return new ComcastDrmPlayReadyContentProtectionIntegration(configuration);
    }
}
