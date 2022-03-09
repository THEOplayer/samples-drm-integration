//
//  VerimatrixCoreDRMIntegration.swift
//  ContentProtectionIntegration
//
//  Created by Wonne Joosen on 09/03/2022.
//  Copyright © 2022 THEOplayer. All rights reserved.
//

import Foundation
import THEOplayerSDK

class VerimatrixCoreDRMIntegration: ContentProtectionIntegration {
    static let integrationID = "verimatrix"
    var configuration: DRMConfiguration
    
    var contentId: String?
    
    init(configuration: DRMConfiguration) {
        self.configuration = configuration
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        let components = skdUrl.components(separatedBy: "?")
        let skd = components.first!
        self.contentId = skd.replacingOccurrences(of: "skd://", with: "")
        return self.contentId!
    }

    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        callback.request(request: request)

    }
    
    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        callback.respond(certificate: response.body)
    }


    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        if let body64 = request.body?.base64EncodedString() {
            let body = "{\"spc\":\"\(body64)\"}"
            request.url = request.url + "?Authorization=" + getAuthorizationFromDrmConfiguration()
            request.headers = [
                "Content-Type":"application/json",
                "User-Agent": "ContentProtectionIntegration/0.0.1"
            ]
            request.body = body.data(using: .utf8)
            callback.request(request: request)
        } else {
            fatalError("RequestBody was nil.")
        }
    }
    
    struct LicResp: Decodable {
        let ckc: String
    }
    
    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        guard let licenseBody = String(data: response.body, encoding: .utf8) else {
            fatalError("Could not create a string from the reponseBody provided.")
        }
        let jsonResponse: LicResp = try! JSONDecoder().decode(LicResp.self, from: licenseBody.data(using: .utf8)!)
        if let data = Data(base64Encoded: jsonResponse.ckc) {
            callback.respond(license: data)
        } else {
            fatalError("Could not create a Data Object from the responseBody provided.")
        }
    }
    
    private func getAuthorizationFromDrmConfiguration() -> String {
        guard let authorization = self.configuration.integrationParameters?["authorization"] as? String else {
            fatalError("Could not find the authorization value in the integrationParameters.")
        }
        return authorization
    }
}

class VerimatrixCoreDRMIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        return VerimatrixCoreDRMIntegration(configuration: configuration)
    }
}
