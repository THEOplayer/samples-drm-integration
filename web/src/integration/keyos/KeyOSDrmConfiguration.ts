import { DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the KeyOS integration.
 */
export type KeyOSIntegrationId = 'keyos';

/**
 * Describes the configuration of the Axinom DRM integration.
 */
export interface KeyOSDrmConfiguration extends DRMConfiguration {

    /**
     * The identifier of the DRM integration.
     */
    integration: KeyOSIntegrationId;

    /**
     * An object of key/value pairs which can be used to pass in specific parameters related to a source into a
     * ContentProtectionIntegration.
     */
    integrationParameters: {
        /**
         * The KeyOS Authorization Token.
         *
         * <br/> - Token that will be added to the headers of the license request.
         */
        token: string;
    }
}
