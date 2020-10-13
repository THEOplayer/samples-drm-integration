import {
    ContentProtectionIntegration,
    ContentProtectionIntegrationFactory
} from 'THEOplayer';
import { VudrmDrmConfiguration } from './VudrmDrmConfiguration';
import { VudrmFairplayContentProtectionIntegration } from "./VudrmFairplayContentProtectionIntegration";

export class VudrmFairplayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
    build(configuration: VudrmDrmConfiguration): ContentProtectionIntegration {
        return new VudrmFairplayContentProtectionIntegration(configuration);
    }
}
