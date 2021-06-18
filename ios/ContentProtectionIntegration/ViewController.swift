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
        return SourceDescription(
            source: TypedSource(
                src: "your stream url",
                type: "application/x-mpegurl",
                drm: FairPlayDRMConfiguration(
                    customIntegrationId: KeyOsDRMIntegration.integrationID,
                    licenseAcquisitionURL: "your license acquisition url",
                    certificateURL: "your certificate url",
                    integrationParameters: ["customdata":"your custom data"]
                )
            )
        )
    }
}
