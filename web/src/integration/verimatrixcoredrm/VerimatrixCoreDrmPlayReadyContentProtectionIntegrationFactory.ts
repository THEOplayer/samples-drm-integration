import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'THEOplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';
import { VerimatrixCoreDrmPlayReadyContentProtectionIntegration } from './VerimatrixCoreDrmPlayReadyContentProtectionIntegration';

export class VerimatrixCoreDrmPlayReadyContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: VerimatrixCoreDrmConfiguration): ContentProtectionIntegration {
    return new VerimatrixCoreDrmPlayReadyContentProtectionIntegration(configuration);
  }
}
