import { DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the Verimatrix Core DRM integration.
 */
export type VerimatrixIntegrationID = 'verimatrixcore';

/**
 * Describes the configuration of the Verimatrix Core DRM integration.
 */
export interface VerimatrixDrmConfiguration extends DRMConfiguration {

    /**
     * The identifier of the DRM integration.
     */
    integration: VerimatrixIntegrationID;

    /**
     * An object of key/value pairs which can be used to pass in specific parameters related to a source into a
     * ContentProtectionIntegration.
     */
    integrationParameters: {

        /**
         * The Verimatrix Token.
         *
         * <br/> - This token will be used for the license request.
         */
        token: string;
    }
}
