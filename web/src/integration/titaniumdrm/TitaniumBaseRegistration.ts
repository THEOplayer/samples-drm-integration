/* eslint-disable no-unused-vars */
import { ContentProtectionError, ErrorCode } from "THEOplayer";
import {
    fromObjectToBase64String,
    fromUint8ArrayToBase64String
} from "../../utils/TypeUtils";
import { isDeviceBasedTitaniumDRMConfiguration, isTokenBasedTitaniumDRMConfiguration } from "./TitaniumUtils";
import { TitaniumDRMConfiguration, DeviceBasedTitaniumDRMConfiguration } from 'THEOplayer';

export interface TitaniumRequestData {
    AuthToken?: string;
    LatensRegistration?: TitaniumBaseRegistration;
    Payload: string;
}

export interface TitaniumBaseRegistration {
    CustomerName: string;
    AccountName: string;
    PortalId: string;
    FriendlyName: string;
    DeviceInfo: TitaniumDeviceInfo;
}

export interface TitaniumDeviceInfo extends TitaniumCDMDescription {
    FormatVersion: string;
    DeviceType: string;
    OSType: string | undefined;
    OSVersion: string | undefined;
    DeviceVendor: string | undefined;
    DeviceModel: string | undefined;
}

export interface TitaniumCDMDescription {
    DRMProvider: string;
    DRMVersion: string;
    DRMType: string;
}

export enum TitaniumCDMType {
    WIDEVINE = 'Widevine',
    PLAYREADY = 'PlayreadyV2',
    PLAYREADY_v2 = 'PlayreadyV2',
    PLAYREADY_v3 = 'PlayreadyV3',
    FAIRPLAY = 'Fairplay'
}

export const TITANIUM_CDM_DESCRIPTIONS: { [cdmType: string /* TitaniumCDMType_*/]: TitaniumCDMDescription } = {
    Widevine: {
        DRMProvider: 'Google',
        DRMVersion: '1.4.8.86',
        DRMType: 'Widevine'
    },
    PlayreadyV2: {
        DRMProvider: 'Microsoft',
        DRMVersion: '2.9',
        DRMType: 'Playready'
    },
    PlayreadyV3: {
        DRMProvider: 'Microsoft',
        DRMVersion: '3',
        DRMType: 'Playready'
    },
    Fairplay: {
        DRMProvider: 'Apple',
        DRMType: 'FairPlay',
        DRMVersion: '1.0'
    }
};

export function getTitaniumLicenseBaseRegistration(
    configuration: DeviceBasedTitaniumDRMConfiguration,
    cdmType: TitaniumCDMType
): TitaniumBaseRegistration {
    const cdmDescription: TitaniumCDMDescription = TITANIUM_CDM_DESCRIPTIONS[cdmType];

    const accountName = configuration.accountName;
    const customerName = configuration.customerName;
    const portalId = configuration.portalId;
    const friendlyName = configuration.friendlyName;

    return {
        CustomerName: customerName,
        AccountName: accountName,
        PortalId: portalId,
        FriendlyName: friendlyName,
        DeviceInfo: {
            FormatVersion: '1',
            DeviceType: 'PC',
            OSType: navigator.platform,
            OSVersion: '',
            DRMProvider: cdmDescription.DRMProvider,
            DRMVersion: cdmDescription.DRMVersion,
            DRMType: cdmDescription.DRMType,
            DeviceVendor: navigator.vendor,
            DeviceModel: navigator.vendorSub
        }
    };
}

export function createErrorForMalformedTitaniumDRMConfiguration(
    configuration: TitaniumDRMConfiguration,
    cdmType: TitaniumCDMType): ContentProtectionError {
    let message = `Invalid Titanium ${cdmType} DRM configuration.`;
    if (!configuration.accountName) {
        message = `Invalid Titanium ${cdmType} DRM configuration, accountName is not set.`;
    } else if (!configuration.customerName) {
        message = `Invalid Titanium ${cdmType} DRM configuration, customerName is not set.`;
    } else if (!configuration.portalId) {
        message = `Invalid Titanium ${cdmType} DRM configuration, portalId is not set.`;
    }
    throw {
        code: ErrorCode.CONTENT_PROTECTION_CONFIGURATION_INVALID,
        message: message
    } as ContentProtectionError;
}

export function createTitaniumCustomData(
    body: Uint8Array,
    configuration: TitaniumDRMConfiguration,
    cdmType: TitaniumCDMType): string {
    if (isTokenBasedTitaniumDRMConfiguration(configuration)) {
        return fromObjectToBase64String({
            AuthToken: configuration.authToken,
            Payload: fromUint8ArrayToBase64String(body)
        } as TitaniumRequestData);
    } else if (isDeviceBasedTitaniumDRMConfiguration(configuration)) {
        return fromObjectToBase64String({
            LatensRegistration: getTitaniumLicenseBaseRegistration(configuration, cdmType),
            Payload: fromUint8ArrayToBase64String(body)
        } as TitaniumRequestData);
    } else {
        throw createErrorForMalformedTitaniumDRMConfiguration(configuration, cdmType);
    }
}

export function createTitaniumCDataHeader(
    configuration: TitaniumDRMConfiguration,
    cdmType: TitaniumCDMType): string {
    if (isTokenBasedTitaniumDRMConfiguration(configuration)) {
        return fromObjectToBase64String({AuthToken: configuration.authToken});
    } else if (isDeviceBasedTitaniumDRMConfiguration(configuration)) {
        return fromObjectToBase64String({LatensRegistration: getTitaniumLicenseBaseRegistration(configuration, cdmType) });
    } else {
        throw createErrorForMalformedTitaniumDRMConfiguration(configuration, cdmType);
    }
}
