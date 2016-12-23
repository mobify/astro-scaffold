//
//  AppDelegate.swift
//  scaffold
//
//  Created by Mike Klemarewski on 2015-06-30.
//  Copyright (c) 2015 Mobify. All rights reserved.
//

import Astro
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var astroViewController: AstroViewController?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // TODO: make it difficult for an Astro developer to delay return from this function.

        // For UAT and DEBUG builds, allow untrusted HTTPS certs
        #if !RELEASE
            AstroConfig.allowUntrustedHTTPSCertificate = true
        #endif

        #if TEST
            AstroConfig.useWKWebView = false
        #endif

        astroViewController = AstroViewController(appJSURL: URL(string: "app.js")!, launchOptions: launchOptions,
            pluginRegistrations: { pluginRegistrar in
                pluginRegistrar.registerPlugin(name: "DoubleIconsPlugin", type: DoubleIconsPlugin.self)
        })
        
        window?.rootViewController = astroViewController
        window?.makeKeyAndVisible()

        // Return false to avoid calling openURL. The deeplink url has already been handled in Astro.
        return false
    }
    
    // Called on receiving deep links unless prevented by didFinish/willFinish
    // didFinish/willFinish are only called if the appplication is not already running
    func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
        astroViewController?.receivedDeeplink(url)
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
        return astroViewController?.continueUserActivity(userActivity) ?? false
    }
}
