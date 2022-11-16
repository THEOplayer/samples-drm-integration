import type { DRMConfiguration } from 'THEOplayer';
import type { TitaniumIntegrationParameters } from './TitaniumIntegrationParameters';

export type TitaniumIntegrationID = 'titaniumdrm';

export interface TitaniumDrmConfiguration extends DRMConfiguration {
    integration: TitaniumIntegrationID;

    integrationParameters: TitaniumIntegrationParameters;
}
