//
//  AppDelegate.swift
//  ContentProtectionIntegration
//
//  Copyright © 2020 THEOplayer. All rights reserved.
//

import UIKit
import THEOplayerSDK

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        THEOplayer.registerContentProtectionIntegration(integrationId: VuDRMIntegration.integrationID, keySystem: .FAIRPLAY, integrationFactory: VuDRMIntegrationFactory())
        
        THEOplayer.registerContentProtectionIntegration(integrationId: UplynkDRMIntegration.integrationID, keySystem: .FAIRPLAY, integrationFactory: UplynkDRMIntegrationFactory())
        
        THEOplayer.registerContentProtectionIntegration(integrationId: AzureDRMIntegration.integrationID, keySystem: .FAIRPLAY, integrationFactory: AzureDRMIntegrationFactory())
        
        THEOplayer.registerContentProtectionIntegration(integrationId: EzdrmDRMIntegration.integrationID, keySystem: .FAIRPLAY, integrationFactory: EzdrmDRMIntegrationFactory())
        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }


}

