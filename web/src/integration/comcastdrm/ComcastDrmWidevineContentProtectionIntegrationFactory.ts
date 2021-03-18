import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { ComcastDrmConfiguration } from './ComcastDrmConfiguration';
import { ComcastDrmWidevineContentProtectionIntegration } from './ComcastDrmWidevineContentProtectionIntegration';

export class ComcastDrmWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: ComcastDrmConfiguration): ContentProtectionIntegration {
        return new ComcastDrmWidevineContentProtectionIntegration(configuration);
    }
}
