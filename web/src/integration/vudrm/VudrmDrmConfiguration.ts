import { DRMConfiguration } from 'THEOplayer';

/**
 * The identifier of the Vudrm integration.
 */
export type VudrmIntegrationID = 'vudrm';

/**
 * Describes the configuration of the Vudrm DRM integration.
 *
 * ```
 * var drmConfiguration = {
 *     integration : 'vudrm',
 *     playready: {
 *          licenseAcquisitionURL: 'yourVudrmPlayReadyLicenseAcquisitionURL'
 *     },
 *     widevine: {
 *         licenseAcquisitionURL: 'yourVudrmWidevineLicenseAcquisitionURL'
 *     },
 *     integrationParameters: {
 *         token: 'PEtleU9T...blhNTD4=',
 *         keyId: '';
 *     }
 * }
 * ```
 */
export interface VudrmDrmConfiguration extends DRMConfiguration {
    /**
     * The identifier of the DRM integration.
     */
    integration: VudrmIntegrationID;
    /**
     * The authentication token.
     */
    token: string;

    /**
     * The key id.
     *
     * <br/> - Only mandatory for Widevine.
     */
    keyId?: string;
}
