//
//  EzdrmDRMIntegration.swift
//  ContentProtectionIntegration
//
//  Copyright © 2021 THEOplayer. All rights reserved.
//

import Foundation
import THEOplayerSDK

class EzdrmDRMIntegration: ContentProtectionIntegration {
    static let integrationID = "EzdrmDRMIntegration"

    func extractFairplayContentId(skdUrl: String) -> String {
        let arr = skdUrl.components(separatedBy: ";")
        let skd = arr[arr.count - 1]
        return skd
    }

    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        callback.request(request: request)
    }

    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        callback.respond(certificate: response.body)
    }

    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        // Setting the `request.url` to a valid dummy URL is necessary to bypass a known limitation.
        // Please note: As of THEOplayerSDK v2.81.0, you could just use the method `LicenseRequestCallback.respond(:data)` inside `onLicenseRequest` without the need to use `onLicenseResponse`.
        request.url = "https://httpstatuses.com/200"
        callback.request(request: request)
    }

    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        guard let serviceUrl = URL(string: response.request.url) else {
            fatalError("'\(response.request.url)' is not a valid URL")
        }
        var request = URLRequest(url: serviceUrl)
        request.httpMethod = "POST"
        request.httpBody = response.request.body
        request.setValue("application/octet-stream", forHTTPHeaderField: "Content-Type")
        URLSession.shared.dataTask(with: request) { (data, response, error) in
            if let data = data {
                callback.respond(license: data)
            } else {
                callback.error(error: error!)
            }
        }.resume()
    }
}

class EzdrmDRMIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        return EzdrmDRMIntegration()
    }
}
