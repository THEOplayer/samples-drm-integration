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

    integrationParameters?: {
        /**
         * The Irdeto Control Content ID.
         *
         * <br/> - This Content ID will be used for the license request.
         */
        contentId?: string;
        /**
         * The Irdeto Control Key ID.
         *
         * <br/> - This Key ID will be used for the license request.
         */
        keyId?: string;
        /**
         * The Irdeto Control Application ID.
         *
         * <br/> - This Application ID will be used for the certificate request.
         */
        applicationId?: string;
    }
}
