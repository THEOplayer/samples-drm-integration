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
        // `LicenseRequestCallback.respond(:data)` - `LicenseRequestCallback.error(:error)` - `CertificateRequestCallback.respond(:data)` and
        // `CertificateRequestCallback.error(:error)` are available as of v2.81.0, so in THEOplayer versions < 2.81.0, setting the `request.url` to a valid
        // dummy URL is necessary to bypass a known limitation.
        // - step: 1
        //      in `onLicenseRequest(:request:callback)`
        //      request.url = "https://httpstatuses.com/200"
        //      callback.request(request: request)
        // - step: 2
        //      in `onLicenseResponse(:response:callback)` you need to download the actual license
        //      and give it back to THEOplayer using `LicenseResponseCallback.respond(:data)`
        var urlRequest = URLRequest(url: URL(string: request.url)!)
        urlRequest.httpMethod = "POST"
        urlRequest.httpBody = request.body
        urlRequest.setValue("application/octet-stream", forHTTPHeaderField: "Content-Type")
        URLSession.shared.dataTask(with: urlRequest) { (data, response, error) in
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
