import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { EzdrmDrmConfiguration } from './EzdrmDrmConfiguration';
import { EzdrmFairplayContentProtectionIntegration } from "./EzdrmFairplayContentProtectionIntegration";

export class EzdrmFairplayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: EzdrmDrmConfiguration): ContentProtectionIntegration {
        return new EzdrmFairplayContentProtectionIntegration(configuration);
    }
}
