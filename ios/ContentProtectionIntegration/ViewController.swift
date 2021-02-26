//
//  ViewController.swift
//  ContentProtectionIntegration
//
//  Copyright © 2020 THEOplayer. All rights reserved.
//

import UIKit
import THEOplayerSDK

class ViewController: UIViewController {
    var theoplayer: THEOplayer!

    override func viewDidLoad() {
        super.viewDidLoad()
        setupTheoPlayer()
        self.theoplayer.source = sampleSource
    }

    func setupTheoPlayer() {
        var frame: CGRect = UIScreen.main.bounds
        frame.origin.y = 0
        frame.size.height = frame.size.width * 9 / 16
        
        self.theoplayer = THEOplayer()
        self.theoplayer.frame =  frame
        self.theoplayer.addAsSubview(of: self.view)
    }

    var sampleSource: SourceDescription {
        var dict = [String: String]()
        dict["token"] = "eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJydGUtcHJkLXByZC10cnQvYW5vbnltb3VzX25ncnBfcGxheWVyQHJ0ZS5pZSIsImlzcyI6IjEiLCJleHAiOjE2MDc0NDg5NjMsImlhdCI6MTYwNzM2MjU2MzcyMCwianRpIjoiMzZiY2VjNzAtOTRjMi00MmFhLTk1MjQtZTVjZWQyODJiZDE2IiwiZGlkIjoicnRlLXByZC1wcmQtdHJ0IiwidW5tIjoiYW5vbnltb3VzX25ncnBfcGxheWVyQHJ0ZS5pZSIsImN0eCI6IntcInVzZXJOYW1lXCI6XCJhbm9ueW1vdXNfbmdycF9wbGF5ZXJAcnRlLmllXCJ9XG4iLCJvaWQiOm51bGx9.HDaUZt0LlKa0rouwmhOSb0ZsYQWzshE3-WhVslWVXrg4JkwKmKoVZGvvSRWIhJ06OVrN9k4Nw50cPipE7pa6L3p9bJN_gwERr0Or-lXm0RVWvefDF1w8g2a_CIgMEwguvsv8RcFYPrX0Wn1mOEETSpqhfYswucUj4r2RyVaVvuZmzBpltd0AGlId2X3Hj-MQW1ra2W1pWmi9i9zoqp3-pWlzfEuioHLip5rWztWSEa6_q15O7QpwnfY8fvUOGQr63yMsjvGBC0LKuaW5cnrrsn9m4HCqjcbhNZZWdyxdbOCc_n-uobRzsV4ORICKgz6YIWcvndUnrX5b6JVRU54e-w"
        dict["releasePid"] = "3KreeLA83ZtE"
        dict["accountId"] = "http://access.auth.theplatform.com/data/Account/2700894001"
        return SourceDescription(
            source: TypedSource(
                src: "https://live.rte.ie/live/a/channel3/channel3.isml/.m3u8?dvr_window_length=30&available=1607364060&expiry=1607396400&ip=108.54.64.36&filter=systemBitrate%3C%3D100000000&token1=19603fb2e92d42d98e82897112a16dcd3f47b2fe3eacb435d0e08247e5a20202",
                type: "application/x-mpegurl",
                drm: FairPlayDRMConfiguration(
                    customIntegrationId: ComcastDRMIntegration.integrationID,
                    licenseAcquisitionURL: "https://fairplay.entitlement.eu.theplatform.com/fpls/web/FairPlay?schema=1.0",
                    certificateURL: "https://cdn.theoplayer.com/demos/rte/fairplay/rte_fairplay.der",
                    integrationParameters: dict
                )
            )
        )
    }
}
