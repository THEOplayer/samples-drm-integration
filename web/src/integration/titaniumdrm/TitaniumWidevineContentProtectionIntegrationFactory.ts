import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { TitaniumWidevineContentProtectionIntegration } from './TitaniumWidevineContentProtectionIntegration';
import { TitaniumDrmIntegrationConfiguration } from './TitaniumDrmIntegrationConfiguration';

export class TitaniumWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: TitaniumDrmIntegrationConfiguration): ContentProtectionIntegration {
        return new TitaniumWidevineContentProtectionIntegration(configuration);
    }
}
