//
//  ArrisTitaniumDrmIntegration.swift
//  ContentProtectionIntegration
//
//  Created by Daniel on 15/11/2022.
//  Copyright © 2022 THEOplayer. All rights reserved.
//

import Foundation
import THEOplayerSDK

/// Sample source usage:
///
/// - Token-based authorization with Cetificate URL
///
///                  var integrationParameters: [String:Any]  = [:]
///                  integrationParameters["authToken"] = "___JWT_AUTH_TOKEN___"
///
///                  let drmConfig = FairPlayDRMConfiguration(
///                                     customIntegrationId: TitaniumDRMIntegration.integrationID,
///                                     licenseAcquisitionURL: "___LICENSE_SERVER_URL___",
///                                     certificateURL: "___CERTIFICATE_URL___",
///                                     integrationParameters: integrationParameters
///                                   )
///
///                  let source = SourceDescription(
///                                     sources: [TypedSource(
///                                         src: "___SOURCE_URL___",
///                                         type: "application/x-mpegurl",
///                                         drm: drmConfig)]
///                               )
///
///                  theoplayer.source = source
///
///
/// - Token-based authorization with base64 encoded Certificate data
///
///                  var integrationParameters: [String:Any]  = [:]
///                  integrationParameters["authToken"] = "___JWT_AUTH_TOKEN___"
///                  integrationParameters["certificateData"] = "___BASE64_ENCODED_CERT___" // passing base64 encoded certificate data instead of loading it from a URL (useful, if the certificate is inside the app)
///
///                  let drmConfig = FairPlayDRMConfiguration(
///                                     customIntegrationId: TitaniumDRMIntegration.integrationID,
///                                     licenseAcquisitionURL: "___LICENSE_SERVER_URL___",
///                                     certificateURL: "https://dummyurl.com", // you can use any dummy URL to trigger and intercept the flow (request will be not executed)
///                                     integrationParameters: integrationParameters
///                                   )
///
///                  let source = SourceDescription(
///                                     sources: [TypedSource(
///                                         src: "___SOURCE_URL___",
///                                         type: "application/x-mpegurl",
///                                         drm: drmConfig)]
///                               )
///
///                  theoplayer.source = source
///
/// - Device-based authorization with Cetificate URL
///
///                  var integrationParameters: [String:Any]  = [:]
///                  integrationParameters["accountName"] = "___ACCOUNT_NAME___" // mandatory parameter for device-based authorization
///                  integrationParameters["customerName"] = "___CUSTOMER_NAME___" // mandatory parameter for device-based authorization
///                  integrationParameters["portalId"] = "___PORTAL_ID_NAME___" // mandatory parameter for device-based authorization
///                  integrationParameters["friendlyName"] = "___FRIENDLY_NAME___" // mandatory parameter for device-based authorization
///
///                  let drmConfig = FairPlayDRMConfiguration(
///                                     customIntegrationId: TitaniumDRMIntegration.integrationID,
///                                     licenseAcquisitionURL: "___LICENSE_SERVER_URL___",
///                                     certificateURL: "___CERTIFICATE_URL___",
///                                     integrationParameters: integrationParameters
///                                   )
///
///                  let source = SourceDescription(
///                                     sources: [TypedSource(
///                                         src: "___SOURCE_URL___",
///                                         type: "application/x-mpegurl",
///                                         drm: drmConfig)]
///                               )
///
///                  theoplayer.source = source

class TitaniumDRMIntegration: ContentProtectionIntegration {
    static let integrationID = "titanium"
    
    let fairplayKeySystemConfiguration: KeySystemConfiguration
    var drmConfiguration: DRMConfiguration
    
    init(drmConfiguration: FairPlayDRMConfiguration) {
        self.drmConfiguration = drmConfiguration
        self.fairplayKeySystemConfiguration = drmConfiguration.fairplay
    }
    
    init(drmConfiguration: MultiplatformDRMConfiguration) {
        self.drmConfiguration = drmConfiguration
        self.fairplayKeySystemConfiguration = drmConfiguration.keySystemConfigurations.fairplay!
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        print("[TitaniumDRMIntegration] <- \(#function): \(skdUrl)")
        let arr = skdUrl.components(separatedBy: "/")
        let skd = arr[arr.count - 1]
        print("[TitaniumDRMIntegration] -> \(#function): \(skd)")
        return skd
    }
    
    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        let requestString = String(data: try! JSONEncoder().encode(request), encoding: .utf8)!
        print("[TitaniumDRMIntegration] <- \(#function): \(requestString)")
        
        if let certificateData = drmConfiguration.integrationParameters?["certificateData"] as? String {
            callback.respond(certificate: Data(base64Encoded: certificateData, options: .ignoreUnknownCharacters)!)
        } else if let certificateURL = fairplayKeySystemConfiguration.certificateURL {
            var newRequest = URLRequest(url: certificateURL)
            newRequest.httpMethod = "GET"
            URLSession.shared.dataTask(with: newRequest) { data, response, error in
                if let error = error {
                    callback.error(error: error)
                    print("[TitaniumDRMIntegration] error", error)
                    return
                }
                
                if let certData = data {
                    print("[TitaniumDRMIntegration] -> \(#function): respond with data")
                    callback.respond(certificate: certData)
                } else {
                    print("[TitaniumDRMIntegration] -> \(#function): error", error)
                    callback.error(error: URLError.init(URLError.badServerResponse))
                }
            }
            .resume()
        } else {
            print("[TitaniumDRMIntegration] -> \(#function): error clientCertificateRequired")
            callback.error(error: URLError.init(URLError.clientCertificateRequired))
        }

    }

    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        let requestString = String(data: try! JSONEncoder().encode(request), encoding: .utf8)!
        print("[TitaniumDRMIntegration] <- \(#function): \(requestString)")

        guard let serviceUrl = fairplayKeySystemConfiguration.licenseAcquisitionURL else {
            fatalError("[TitaniumDRMIntegration] LA is not a valid URL")
        }
        var urlRequest = URLRequest(url: serviceUrl)
        
        // support for token-based authorization
        if let authToken = drmConfiguration.integrationParameters?["authToken"] as? String {
            urlRequest.setValue("Bearer " + authToken, forHTTPHeaderField: "Authorization")

        // support for device specific authorization
        } else if let accountName = drmConfiguration.integrationParameters?["accountName"] as? String,
                  let customerName = drmConfiguration.integrationParameters?["customerName"] as? String,
                  let portalId = drmConfiguration.integrationParameters?["portalId"] as? String,
                  let friendlyName = drmConfiguration.integrationParameters?["friendlyName"] as? String {
            
            let lr = DeviceSpecificAuth(LatensRegistration: LatensRegistration(CustomerName: customerName, AccountName: accountName, PortalId: portalId, FriendlyName: friendlyName, DeviceInfo: DeviceInfo()))
            
            urlRequest.setValue(try! JSONEncoder().encode(lr).base64EncodedString(), forHTTPHeaderField: "X-TITANIUM-DRM-CDATA")

        } else {
            print("[TitaniumDRMIntegration] -> \(#function): error userAuthenticationRequired")
            callback.error(error: URLError.init(URLError.userAuthenticationRequired))
            return
        }
        
        urlRequest.httpMethod = "POST"
        urlRequest.httpBody = request.body
        urlRequest.setValue("application/octet-stream", forHTTPHeaderField: "Content-Type")

        URLSession.shared.dataTask(with: urlRequest) { (data, response, error) in
            if let data = data {
                print("[TitaniumDRMIntegration] -> \(#function): respond with license")
                callback.respond(license: data)
            } else {
                print("[TitaniumDRMIntegration] -> \(#function): error", error)
                callback.error(error: error!)
            }
        }.resume()
         
    }
    
    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        print("[TitaniumDRMIntegration] <- \(#function): response")
        callback.respond(license: response.body)
    }
     
}

class TitaniumDRMIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        if let fairplayConfiguration = configuration as? FairPlayDRMConfiguration {
            return TitaniumDRMIntegration(drmConfiguration: fairplayConfiguration)
        } else if let multiDrm = configuration as? MultiplatformDRMConfiguration, multiDrm.keySystemConfigurations.fairplay != nil {
            return TitaniumDRMIntegration(drmConfiguration: multiDrm)
        } else {
            fatalError("DRMConfiguration must contain a FairPlay Keysystem configuration")
        }
    }
}

struct DeviceSpecificAuth: Encodable {
    var LatensRegistration: LatensRegistration
}

struct LatensRegistration: Encodable {
    var CustomerName: String
    var AccountName: String
    var PortalId: String
    var FriendlyName: String
    var AppVersion: String = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? ""
    var DeviceInfo: DeviceInfo
}

struct DeviceInfo: Encodable {
    var FormatVersion: String = "1"
    var varDeviceType: String = DeviceInfo.getDeviceType()
    var OSType: String = UIDevice.current.systemName
    var OSVersion: String = UIDevice.current.systemVersion
    var DRMProvider: String = "Apple"
    var DRMVersion: String = "1.0"
    var DRMType: String = "Fairplay"
    var DeviceVendor: String = "Apple"
    var DeviceModel: String = UIDevice.current.model
    
    static func getDeviceType() -> String {
        switch UIDevice.current.userInterfaceIdiom {
        case .carPlay:
            return "CarPlay"
        case .mac:
            return "Mac"
        case .pad:
            return "iPad"
        case .phone:
            return "iPhone"
        case .tv:
            return "AppleTV"
        default:
            return "Unknown"
        }
    }
}
