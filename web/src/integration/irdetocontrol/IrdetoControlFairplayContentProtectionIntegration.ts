import {
    BufferSource,
    ContentProtectionIntegration,
    LicenseResponse,
    MaybeAsync
} from 'THEOplayer';
import { IrdetoControlConfiguration } from './IrdetoControlConfiguration';

export class IrdetoControlFairplayContentProtectionIntegration implements ContentProtectionIntegration {
    private readonly contentProtectionConfiguration: IrdetoControlConfiguration;

    constructor(configuration: IrdetoControlConfiguration) {
        this.contentProtectionConfiguration = configuration;
    }

    onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
        return response.body;
    }
}
