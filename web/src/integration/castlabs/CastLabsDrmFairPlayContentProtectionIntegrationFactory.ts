import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { CastLabsDrmConfiguration } from './CastLabsDrmConfiguration';
import { CastLabsDrmFairPlayContentProtectionIntegration } from './CastLabsDrmFairPlayContentProtectionIntegration';

export class CastLabsDrmFairPlayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: CastLabsDrmConfiguration): ContentProtectionIntegration {
        console.log("do this");
        return new CastLabsDrmFairPlayContentProtectionIntegration(configuration);
    }
}
