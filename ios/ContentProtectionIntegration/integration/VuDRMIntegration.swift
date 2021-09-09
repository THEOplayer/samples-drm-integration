//
//  VuDRMIntegration.swift
//  ContentProtectionIntegration
//
//  Copyright © 2020 THEOplayer. All rights reserved.
//

import Foundation
import THEOplayerSDK


class VuDRMIntegration: ContentProtectionIntegration {
    static let integrationID = "customVuDRM"
    var contentID: String?
    var configuration: DRMConfiguration
    
    init(configuration: DRMConfiguration) {
        self.configuration = configuration
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        let arr = skdUrl.components(separatedBy: "/")
        let skd = arr[arr.count - 1]
        self.contentID = skd
        return skd
    }

    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        request.headers.updateValue(self.getTokenFromDrmConfiguration(), forKey: "x-vudrm-token")
        request.headers.updateValue("application/json", forKey: "Content-Type")
        callback.request(request: request)
    }

    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        callback.respond(certificate: response.body)
    }

    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        guard let contentID = self.contentID else {
            fatalError("contentID was nil.")
        }
        request.headers.updateValue("application/json", forKey: "content-type")
        
        var dict = [String: String]()
        dict.updateValue(self.getTokenFromDrmConfiguration(), forKey: "token")
        dict.updateValue(contentID, forKey: "contentId")
        if let payload = fromDataToBase64String(data: request.body) {
            dict.updateValue(payload, forKey: "payload")
        }
        do {
            request.body = try JSONEncoder().encode(dict)
            callback.request(request: request)
        } catch let error {
            fatalError(error.localizedDescription)
        }
    }

    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        callback.respond(license: response.body)
    }
    
    private func getTokenFromDrmConfiguration() -> String {
        guard let token = self.configuration.integrationParameters?["token"] as? String else {
            fatalError("Could not find the token in the integrationParameters")
        }
        return token
    }
}

class VuDRMIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        return VuDRMIntegration(configuration: configuration)
    }
}
