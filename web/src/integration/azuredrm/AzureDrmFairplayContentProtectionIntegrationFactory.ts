import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { AzureDrmConfiguration } from './AzureDrmConfiguration';
import { AzureDrmFairplayContentProtectionIntegration } from './AzureDrmFairplayContentProtectionIntegration';

export class AzureDrmFairplayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: AzureDrmConfiguration): ContentProtectionIntegration {
        return new AzureDrmFairplayContentProtectionIntegration(configuration);
    }
}
