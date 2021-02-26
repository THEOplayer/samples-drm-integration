import { DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the Azure Media Services integration.
 */
export type ComcastIntegrationID = 'comcast';

/**
 * Describes the configuration of the Azure Media Services DRM integration.
 */
export interface ComcastDrmConfiguration extends DRMConfiguration {

    /**
     * The identifier of the DRM integration.
     */
    integration: ComcastIntegrationID;

    /**
     * An object of key/value pairs which can be used to pass in specific parameters related to a source into a
     * ContentProtectionIntegration.
     */
    integrationParameters: {

        /**
         * The Comcast Release Pid.
         *
         * <br/> - This releasePid will be used for the license request.
         */
        releasePid: string;

        /**
         * The Comcast Account ID.
         *
         * <br/> - This accountId will be used for the license request.
         */
        accountId: string;

        /**
         * The Comcast Token.
         *
         * <br/> - This token will be used for the license request.
         */
        token: string;
    }
}
