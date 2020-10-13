//
//  UplynkDRMIntegration.swift
//  ContentProtectionIntegration
//
//  Copyright © 2020 THEOplayer. All rights reserved.
//

import Foundation
import THEOplayerSDK

class UplynkDRMIntegration: ContentProtectionIntegration {
    static let integrationID = "customUplynkDRM"
    let UPLYNK_CONTENT_ID_PARAMETER_NAME = "b";
    var skdUrl: String?
    
    var configuration: DRMConfiguration
    init(configuration: DRMConfiguration) {
        self.configuration = configuration
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        self.skdUrl = skdUrl
        guard let urlComponents = URLComponents(string: skdUrl),
              let queryItems = urlComponents.queryItems,
              let queryItemSkd = queryItems.first(where: { $0.name == UPLYNK_CONTENT_ID_PARAMETER_NAME }),
              let skd = queryItemSkd.value
        else {
            fatalError("Could Not parse the skd")
        }
        return skd
    }

    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        callback.request(request: request)
    }

    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        callback.respond(certificate: response.body)
    }

    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        guard let skdUrl = self.skdUrl else {
            fatalError("skdUrl was nil.")
        }
        let laURL = skdUrl.replacingOccurrences(of: "skd://", with: "https://")
        request.url = laURL
        var dict = [String: String]()
        if let spc = request.body?.base64EncodedString() {
            dict.updateValue(spc, forKey: "spc")
        }
        do {
            request.body = try JSONEncoder().encode(dict)
            callback.request(request: request)
        } catch let error {
            fatalError(error.localizedDescription)
        }
    }

    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        do {
            let dto = try JSONDecoder().decode(UplynkDRMLicenseResponse.self, from: response.body)
            guard let responseBody = Data(base64Encoded: dto.ckc) else {
                fatalError("Could not Decode base64Encoded ckc")
            }
            response.body = responseBody
            callback.respond(license: response.body)
        } catch let err {
            print(err)
            callback.error(error: err)
        }
    }
    
    private struct UplynkDRMLicenseResponse: Codable {
        var ckc: String
    }
}

class UplynkDRMIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        return UplynkDRMIntegration(configuration: configuration)
    }
}
