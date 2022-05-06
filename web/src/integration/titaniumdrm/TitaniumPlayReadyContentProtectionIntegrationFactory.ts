import { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'THEOplayer';
import { TitaniumPlayReadyContentProtectionIntegration } from './TitaniumPlayReadyContentProtectionIntegration';
import { TitaniumDrmIntegrationConfiguration } from './TitaniumDrmIntegrationConfiguration';

export class TitaniumPlayReadyContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: TitaniumDrmIntegrationConfiguration): ContentProtectionIntegration {
        return new TitaniumPlayReadyContentProtectionIntegration(configuration);
    }
}
