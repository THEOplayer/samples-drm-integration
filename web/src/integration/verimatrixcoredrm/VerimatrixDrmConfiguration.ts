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
}
