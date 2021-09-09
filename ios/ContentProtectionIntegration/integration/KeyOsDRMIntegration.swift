//
//  KeyOsDRMIntegration.swift
//  ContentProtectionIntegration
//
//  Created by Wonne Joosen on 18/06/2021.
//  Copyright © 2021 THEOplayer. All rights reserved.
//

import Foundation
import THEOplayerSDK

class KeyOsDRMIntegration: ContentProtectionIntegration {
    static let integrationID = "customkeyosDRM"
    var configuration: DRMConfiguration
    
    var contentId: String?
    
    init(configuration: DRMConfiguration) {
        self.configuration = configuration
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        let components = skdUrl.components(separatedBy: "?")
        let skd = components.last!
        self.contentId = skd.replacingOccurrences(of: "skd://", with: "")
        return skd
    }

    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        request.headers.updateValue(self.getCustomdataFromDrmConfiguration(), forKey: "customdata")
        callback.request(request: request)

    }
    
    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        callback.respond(certificate: response.body)
    }


    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        guard let contentId = self.contentId else {
            fatalError("contentID was nil.")
        }
        
        request.headers.updateValue(self.getCustomdataFromDrmConfiguration(), forKey: "customdata")

        if let body64 = fromDataToBase64String(data: request.body) {
            request.body = fromUtf8StringToData(str: "spc=\(body64)&assetId=\(contentId)")
            callback.request(request: request)
        } else {
            fatalError("RequestBody was nil.")
        }
    }

    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        guard var licenseBody = fromDataToUtf8String(data: response.body) else {
            fatalError("Could not create a string from the reponseBody provided.")
        }
        licenseBody = licenseBody.replacingOccurrences(of: "<ckc>", with: "")
        licenseBody = licenseBody.replacingOccurrences(of: "</ckc>", with: "")
        if let data = fromBase64StringToData(base64Encoded: licenseBody) {
            callback.respond(license: data)
        } else {
            fatalError("Could not create a Data Object from the responseBody provided.")
        }
    }
    
    private func getCustomdataFromDrmConfiguration() -> String {
        guard let customdata = self.configuration.integrationParameters?["customdata"] as? String else {
            fatalError("Could not find the customdata value in the integrationParameters.")
        }
        return customdata
    }
}

class KeyOsDRMIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        return KeyOsDRMIntegration(configuration: configuration)
    }
}
