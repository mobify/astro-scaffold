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

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // TODO: make it difficult for an Astro developer to delay return from this function.

        // For UAT and DEBUG builds, allow untrusted HTTPS certs
        #if !RELEASE
            AstroConfig.allowUntrustedHTTPSCertificate = true
        #endif

        // Due to the inability to navigate to pages with untrusted SSL certs on WKWebView
        // with iOS < 9, we've decided to only use WKWebView for iOS 9 and above. It will be
        // too difficult to develop and test if we have to constantly worry about this.
        if #available(iOS 9.0, *) {
            AstroConfig.useWKWebView = true
        }

        astroViewController = AstroViewController(appJsUrl: NSURL(string: "app.js")!, launchOptions: launchOptions,
            pluginRegistrations: { pluginRegistrar in
        })
        
        window?.rootViewController = astroViewController
        window?.makeKeyAndVisible()
        
        // This is as sketchy as it appears.  We want to let the main thread run loop
        // run so that the AstroViewController can spin up and get app.js executing.
        // This allows any splash screen presented to be displayed before the Launch Image
        // is dismissed (at the end of didFinishLaunchingWithOptions).
        NSRunLoop.mainRunLoop().runUntilDate(NSDate().dateByAddingTimeInterval(1.0))
        
        // Return false to avoid calling openURL. The deeplink url has already been handled in Astro.
        return false
    }
    
    // Called on receiving deep links unless prevented by didFinish/willFinish
    // didFinish/willFinish are only called if the appplication is not already running
    func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject) -> Bool {
        if let astroViewController = astroViewController {
            astroViewController.receivedDeeplink(url)
        }
        return true
    }

    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


}

