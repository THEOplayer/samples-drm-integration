//
//  ComcastDRMIntegration.swift
//  ContentProtectionIntegration
//
//  Copyright © 2020 THEOplayer. All rights reserved.
//

import Foundation
import THEOplayerSDK

class ComcastDRMIntegration: ContentProtectionIntegration {
    static let integrationID = "customComcastDRM"
    var contentId: String?
    
    var configuration: DRMConfiguration
    init(configuration: DRMConfiguration) {
        self.configuration = configuration
    }
    
    func extractFairplayContentId(skdUrl: String) -> String {
        let releasePid = self.getParameterFromDrmConfiguration(parameter: "releasePid")
        let modifiedContentId = skdUrl.replacingOccurrences(of: "FairPlay", with: releasePid)
        let components = modifiedContentId.components(separatedBy: "?")
        let skd = components.last!
        self.contentId = skd
        print("contentId")
        self.contentId = releasePid
        print(self.contentId!)
        return self.contentId!
    }
    
    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        print("cert request")
        callback.request(request: request)
    }

    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        print("cert response")
        callback.respond(certificate: response.body)
    }

    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        print("license request")
//        callback.request(request: request)
        print("og body", type(of: request.body), request.body!)
        let token = self.getParameterFromDrmConfiguration(parameter: "token")
        let releasePid = self.getParameterFromDrmConfiguration(parameter: "releasePid")
        let accountId = self.getParameterFromDrmConfiguration(parameter: "accountId")
        let laURL = request.url + "&token=" + token + "&account=" + accountId + "&form=json"
        request.url = laURL
        var spcMessage = request.body?.base64EncodedString()
        let other = "&assetId=" + contentId!
        var data2 = "spc=".data(using: .utf8)
        data2?.append(request.body!)
        data2!.append(other.data(using: .utf8)!)
//        request.body?.
//        spcMessage = "spc=\(spcMessage)&assetId=\(contentId)"
        print("spcMEssage", spcMessage!)
        var dict = ["getFairplayLicense": ["releasePid":releasePid, "spcMessage": data2?.base64EncodedString()]]
        request.headers = [
            "Content-Type": "application/json"
        ]
        do {
            
            var body = try JSONEncoder().encode(dict)
//            var pretty = String(data: body, encoding: .)!
//            pretty = "spc=" + pretty.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)! + "&assetId=" + releasePid;
//            pretty = pretty.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
//            print("pretty", pretty)
//            let bytes = pretty.utf8
//            let buffer = [UInt8](bytes)
//            request.body = Data(buffer)
//            let buffer = pretty.data(using: .utf8)
            request.body = body
            callback.request(request: request)
        } catch let error {
            print("error")
            fatalError(error.localizedDescription)
        }
    }
    

    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        print("license response", response, response.body)
        guard var licenseBody = String(data: response.body, encoding: .utf8) else {
            print("Could not create a string from the reponseBody provided.")
            fatalError("fatal")
        }
        print("licensebody", licenseBody)
        do {
//            let resp = response.body.
            let responseAsText = try JSONDecoder().decode(ComcastDRMLicenseResponse.self, from: response.body)
            print("responseAsText")
            print(responseAsText)
        } catch let error {
            print("error", error)
        }
        callback.respond(license: response.body)
    }
    
    private struct ComcastDRMLicenseResponse: Codable {
        var getFairplayLicenseResponse: [String:String]
    }
    
    private func getParameterFromDrmConfiguration(parameter: String) -> String {
        guard let token = self.configuration.integrationParameters?[parameter] as? String else {
            fatalError("Could not find the " + parameter + " in the integrationParameters.")
        }
        return token
    }

}

class ComcastDRMIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        return ComcastDRMIntegration(configuration: configuration)
    }
}
