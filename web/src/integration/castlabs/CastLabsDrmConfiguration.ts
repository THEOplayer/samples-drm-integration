import { DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the Comcast DRM integration.
 */
export type DRMTodayIntegrationID = 'castlabs';

/**
 * Describes the configuration of the Comcast DRM integration.
 */
export interface CastLabsDrmConfiguration extends DRMConfiguration {

    /**
     * The identifier of the DRM integration.
     */
    integration: DRMTodayIntegrationID;

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
        merchant: string;

        /**
         * The Comcast Account ID.
         *
         * <br/> - This account will be used for the license request.
         */
        sessionId: string;

        /**
         * The Comcast Token.
         *
         * <br/> - This token will be used for the license request.
         */
        userId: string;
    }
}
