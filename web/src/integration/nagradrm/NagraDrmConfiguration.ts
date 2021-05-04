import { DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the Nagra integration.
 */
export type NagraIntegrationId = "nagra";

/**
 * Describes the configuration of the Axinom DRM integration.
 */
export interface NagraDrmConfiguration extends DRMConfiguration {
    /**
     * The identifier of the DRM integration.
     */
    integration: NagraIntegrationId;

    /**
     * An object of key/value pairs which can be used to pass in specific parameters related to a source into a
     * ContentProtectionIntegration.
     */
    integrationParameters: {
        /**
         * The Axinom Authorization Token.
         *
         * <br/> - Token that will be added to the headers of the license request.
         */
        token: string;
        tenantId: string;
    };
}
