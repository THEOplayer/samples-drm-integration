//
//  AzureDRMIntegration.swift
//  ContentProtectionIntegration
//
//  Copyright © 2020 THEOplayer. All rights reserved.
//

import Foundation
import THEOplayerSDK

class AzureDRMIntegration: ContentProtectionIntegration {
    static let integrationID = "customAzureDRM"
    var configuration: DRMConfiguration
    
    var contentId: String?
    
    init(configuration: DRMConfiguration) {
        self.configuration = configuration
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        let components = skdUrl.components(separatedBy: "?")
        let skd = components.last!
        self.contentId = skd
        return skd
    }

    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        request.headers = [
            "Authorization": "Bearer \(self.getTokenFromDrmConfiguration())",
            "Content-Type": "application/x-www-form-urlencoded"
        ]
        callback.request(request: request)
    }

    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        callback.respond(certificate: response.body)
    }

    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        guard let contentId = self.contentId else {
            fatalError("contentID was nil.")
        }
        request.headers = [
            "Authorization": "Bearer \(self.getTokenFromDrmConfiguration())",
            "Content-Type": "application/x-www-form-urlencoded"
        ]
        if let body64 = request.body?.base64EncodedString() {
            let body = "spc=\(body64)&assetId=\(contentId)"
            request.body = body.data(using: .utf8)!
            callback.request(request: request)
        } else {
            fatalError("RequestBody was nil.")
        }
    }

    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        guard var licenseBody = String(data: response.body, encoding: .utf8) else {
            fatalError("Could not create a string from the reponseBody provided.")
        }
        licenseBody = licenseBody.replacingOccurrences(of: "<ckc>", with: "")
        licenseBody = licenseBody.replacingOccurrences(of: "</ckc>", with: "")
        if let data = Data(base64Encoded: licenseBody) {
            callback.respond(license: data)
        } else {
            fatalError("Could not create a Data Object from the responseBody provided.")
        }
    }
    
    private func getTokenFromDrmConfiguration() -> String {
        guard let token = self.configuration.integrationParameters?["token"] as? String else {
            fatalError("Could not find the token in the integrationParameters.")
        }
        return token
    }
}

class AzureDRMIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        return AzureDRMIntegration(configuration: configuration)
    }
}
