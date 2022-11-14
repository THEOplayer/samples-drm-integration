package com.theoplayer.contentprotectionintegration.integration.titanium

data class TitaniumCDMDescription(
    /**
     * String denoting the vendor of the underlying Content Decryption Module (CDM) provided by
     * the host platform, e.g. “Google” (OPTIONAL)
     */
    val DRMProvider: String,

    /**
     * String denoting the CDM version (OPTIONAL)
     */
    val DRMVersion: String,

    /**
     * String denoting the DRM scheme that the CDM implements, e.g. “Widevine” (OPTIONAL)
     */
    val DRMType: String,
)

val TitaniumWidevineCDMDescription = TitaniumCDMDescription(
"Google",
"1.4.8.86",
"Widevine"
)

val PlayreadyV2CDMDescription = TitaniumCDMDescription(
    "Microsoft",
    "2.9",
    "Playready"
)

val PlayreadyV3CDMDescription = TitaniumCDMDescription(
    "Microsoft",
    "3",
    "Playready"
)

data class TitaniumDeviceInfo(
    /**
     * String that should be set to the value “1” for applications compliant with the latest
     * document version.
     */
    val FormatVersion: String,

    /**
     * String that should be set to the value “PC” for browser-based applications (OPTIONAL).
     */
    val DeviceType: String,

    /**
     * String denoting the operating system version of the host platform, e.g. “Linux” (OPTIONAL).
     */
    val OSType: String,

    /**
     * String denoting the operating system version of the host platform, e.g. “8.1” (OPTIONAL).
     */
    val OSVersion: String,

    /**
     * String denoting the vendor of the underlying Content Decryption Module (CDM) provided by
     * the host platform, e.g. “Google” (OPTIONAL).
     */
    val DRMProvider: String,

    /**
     * String denoting the CDM version (OPTIONAL).
     */
    val DRMVersion: String,

    /**
     * String denoting the DRM scheme that the CDM implements, e.g. “Widevine” (OPTIONAL).
     */
    val DRMType: String,

    /**
     * String denoting the OEM vendor of the host hardware platform (OPTIONAL).
     */
    val DeviceVendor: String,

    /**
     * String denoting the OEM model identifier of the host hardware platform (OPTIONAL).
     */
    val DeviceModel: String
)

data class TitaniumLatensRegistration(
    /**
     * String denoting the Customer ID attribute as defined in the MultiTrust subscriber management
     * system.
     */
    val CustomerName: String,

    /**
     * String denoting the Account ID attribute as defined in the MultiTrust subscriber management
     * system.
     */
    val AccountName: String,

    /**
     * String denoting a unique identifier derived for this device and provisioned in the
     * MultiTrust subscriber management system.
     */
    val PortalId: String,

    /**
     * String denoting an application defined ‘friendly name’ associated with this device.
     */
    val FriendlyName: String,

    /**
     * String denoting the versioning information for the application (OPTIONAL).
     */
    val AppVersion: String?,

    /**
     * Object describing the host platform.
     */
    val DeviceInfo: TitaniumDeviceInfo
)

data class TitaniumDeviceAuthorizationData(
    val LatensRegistration: TitaniumLatensRegistration
)
