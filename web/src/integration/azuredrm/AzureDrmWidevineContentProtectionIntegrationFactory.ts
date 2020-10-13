import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { AzureDrmConfiguration } from './AzureDrmConfiguration';
import { AzureDrmWidevineContentProtectionIntegration } from './AzureDrmWidevineContentProtectionIntegration';

export class AzureDrmWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: AzureDrmConfiguration): ContentProtectionIntegration {
        return new AzureDrmWidevineContentProtectionIntegration(configuration);
    }
}
