import { DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the Azure Media Services integration.
 */
export type AzureIntegrationID = 'azure';

/**
 * Describes the configuration of the Azure Media Services DRM integration.
 */
export interface AzureDrmConfiguration extends DRMConfiguration {

    /**
     * The identifier of the DRM integration.
     */
    integration: AzureIntegrationID;

    /**
     * An object of key/value pairs which can be used to pass in specific parameters related to a source into a
     * ContentProtectionIntegration.
     */
    integrationParameters: {
        /**
         * The Azure Media Services Authorization Token.
         *
         * <br/> - This token will be used for the license request.
         */
        token: string;
    }
}
