import { TitaniumDRMConfiguration, DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the Titanium integration.
 */
export type TitaniumIntegrationID = 'titaniumdrm';

export interface TitaniumDrmIntegrationConfiguration extends DRMConfiguration {

    integration: TitaniumIntegrationID;

    integrationParameters: TitaniumDRMConfiguration;
}
