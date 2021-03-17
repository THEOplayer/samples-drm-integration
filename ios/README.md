## Getting started on iOS

### Creating a new integration

First create a custom implementation of [ContentProtectionIntegration](https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/doc/ios/latest/External%20Content%20Protection%20integration%20API.html#/c:@M@THEOplayerSDK@objc(pl)ContentProtectionIntegration)
under `ios/ContentProtectionIntegration/integration`.
This object defines handler methods that allow altering license and certificate requests and responses as part of the
DRM flow.
All methods are optional. They can be omitted if the integration does not require additional action, in which case the
default implementation will be used.

```swift
import Foundation
import THEOplayerSDK

class MyCustomIntegration: ContentProtectionIntegration {
    static let integrationID = "myCustomDRM"
    
    let configuration: DRMConfiguration
    
    init(configuration: DRMConfiguration) {
        self.configuration = configuration
    }

    func onCertificateRequest(request: CertificateRequest, callback: CertificateRequestCallback) {
        callback.request(request: request)
    }

    func onCertificateResponse(response: CertificateResponse, callback: CertificateResponseCallback) {
        callback.respond(certificate: response.body)
    }

    func onLicenseRequest(request: LicenseRequest, callback: LicenseRequestCallback) {
        // request.headers = [
        //     "x-token": self.getTokenFromDrmConfiguration(),
        // ]
        callback.request(request: request)
    }

    func onLicenseResponse(response: LicenseResponse, callback: LicenseResponseCallback) {
        callback.respond(license: response.body)
    }

    func extractFairplayContentId(skdUrl: String) -> String {
        return "<contentId>"
    }

    private func getTokenFromDrmConfiguration() -> String {
        guard let token = self.configuration.integrationParameters?["token"] as? String else {
            fatalError("Could not find the token in the integrationParameters.")
        }
        return token
    }
}
```

Optional parameters needed for certificate or license requests, such as tokens, can be added to a
[DRMConfiguration](https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/doc/ios/latest/Protocols/DRMConfiguration.html)
object that is passed when creating instances of the `MyCustomIntegration` class.
In the example, `MyCustomIntegration` adds a token from the configuration object as part of the headers
during a license request.

Next, create a [ContentProtectionIntegrationFactory](https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/doc/ios/latest/External%20Content%20Protection%20integration%20API.html#/s:13THEOplayerSDK35ContentProtectionIntegrationFactoryP) for building MyCustomIntegration instances.
THEOplayer will use this factory in its DRM flow whenever it needs a ContentProtectionIntegration instance that
matches with the content protected source. How THEOplayer knows which factory to take will be determined in the
`registerContentProtectionIntegration` step next.

```swift
class MyCustomIntegrationFactory: ContentProtectionIntegrationFactory {
    func build(configuration: DRMConfiguration) -> ContentProtectionIntegration {
        return MyCustomIntegration(configuration: configuration)
    }
}
```

An instance of `MyCustomIntegrationFactory` needs to be registered with THEOplayer's global instance in
[AppDelegate](/ios/ContentProtectionIntegration/AppDelegate.swift)
by specifying a unique `integrationId`, such as `"myCustomDRM"` in this example.

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        THEOplayer.registerContentProtectionIntegration(integrationId: MyCustomIntegration.integrationID, keySystem: .FAIRPLAY, integrationFactory: MyCustomIntegrationFactory())
        return true
    }
}
```

When the player now loads a source with a `customIntegrationId` that matches the `integrationId`
passed during registration, an instance of `MyCustomIntegration` will be created and used in the DRM flow.

Also, fill the source description in [ViewController](/ios/ContentProtectionIntegration/ViewController.swift),
which provides the manifest, certificate and license URLs along with any integration parameters.

*Note: The Dictionary ```integrationParameters``` only supports Primitive-types and Codable values. all other types will ignored*
```swift
var sampleSource: SourceDescription {
    return SourceDescription(
        source: TypedSource(
            src: "<insert_manifest_here>",
            type: "application/x-mpegurl",
            drm: FairPlayDRMConfiguration(
                customIntegrationId: MyCustomIntegration.integrationID,
                licenseAcquisitionURL: "<insert_license_url>",
                certificateURL: "<insert_certificate_url>",
                integrationParameters: [
                    // optional integration parameters
                    // "token": "<insert_token>"
                ]
            )
        )
    )
}
```
Finally, build and run the app on an iOS device.

### Available examples

- Vualto VuDRM
- Microsoft Azure DRM
- Verizon Uplynk DRM
- EZ DRM

### Testing an integration

- Add your iOS THEOplayerSDK framework into the [/ios]() folder.
- Open the [project](/ios/ContentProtectionIntegration.xcodeproj) and 
 [add the framework as a dependency](https://docs.portal.theoplayer.com/getting-started/01-sdks/03-ios/00-getting-started.md#configure-theoplayer-sdk-framework) 
 to your project.
- Make sure to fill in the necessary fields `ViewController` for the content integration that will be tested, such as the manifest url and any integration parameters.
- Attach an iOS device, and finally build and run the project.
