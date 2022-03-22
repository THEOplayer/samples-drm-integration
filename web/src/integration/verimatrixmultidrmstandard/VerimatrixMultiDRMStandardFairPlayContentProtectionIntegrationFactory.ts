import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { VerimatrixMultiDRMStandardConfiguration } from './VerimatrixMultiDRMStandardConfiguration';
import { VerimatrixMultiDRMStandardFairPlayContentProtectionIntegration } from './VerimatrixMultiDRMStandardFairPlayContentProtectionIntegration';

export class VerimatrixMultiDRMStandardFairPlayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: VerimatrixMultiDRMStandardConfiguration): ContentProtectionIntegration {
        return new VerimatrixMultiDRMStandardFairPlayContentProtectionIntegration(configuration);
    }
}
