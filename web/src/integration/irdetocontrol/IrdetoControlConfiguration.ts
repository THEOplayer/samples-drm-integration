import { DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the Irdeto Control integration.
 */
export type IrdetoControlIntegrationID = 'irdetocontrol';

/**
 * Describes the configuration of the Irdeto Control DRM integration.
 */
export interface IrdetoControlConfiguration extends DRMConfiguration {

    /**
     * The identifier of the DRM integration.
     */
    integration: IrdetoControlIntegrationID;

}
