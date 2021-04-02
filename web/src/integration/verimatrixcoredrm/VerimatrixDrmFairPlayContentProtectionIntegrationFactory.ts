import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { VerimatrixDrmConfiguration } from './VerimatrixDrmConfiguration';
import { VerimatrixDrmFairPlayContentProtectionIntegration } from './VerimatrixDrmFairPlayContentProtectionIntegration';

export class VerimatrixDrmFairPlayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: VerimatrixDrmConfiguration): ContentProtectionIntegration {
        return new VerimatrixDrmFairPlayContentProtectionIntegration(configuration);
    }
}
