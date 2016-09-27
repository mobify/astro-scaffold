## To be released
- Integrate the Mobify preview plugin
- Welcome modal now relies on installationId to determine whether to show
- Add Requirements to README, and "engines" field to package.json
- Add Segmented Plugin

## v0.15.0
- [iOS] Remove update bundle version build phase

## v0.14.0
- `build-js.sh` is much smarter and looks for npm in `.nvm` now!
- Updated `grunt-eslint` to v19.0.0
- [Android] Updated to be compatible with Android Cordova v5.1.1
- [iOS] Include pushclient module in iOS build
- [iOS] Add support for universal deeplinking
- [Both] Tab Navigation for both iOS and Android - disallow one platform using one navigation type while the other platform use the other navigation type

## v0.13.0
- Include pushclient module in android build
- [iOS] set app to portrait-only
- [iOS] implement pop-to-root on re-selection of currently displaying tab item

## v0.12.0
- Update app icon resource for Xcode 7

## v0.11.0
- Update to navitron 1.0
- Add support for buddybuild
- Update scripts depending on a globally-installed version of grunt to use a local version (and updated package.json to install it locally)

## v0.10.1
- Upgrade to use Android Studio 2.0

## v0.9.0
- Event bus added for communication between app components on the js side
- Replaced drawer layout with a multi-level drawer navigation (Navitron)
- TabBar item configuration moved to `tabConfig.js`
- Add a search bar which can be opened with the search icon
- Add double icons custom plugin. Add a search icon and cart icon on the right side of the header
- Error modal is now configurable through the `errorConfig.js` file
- Error modal displays when navigating with no connectivity or when page times out
- iOS layout is now configurable through the `baseConfig.js` file
- Welcome modal styling is now configurable through the `welcomeConfig.js` file
- Welcome modal with toggle-able header displays on startup
- Header content propagated while navigating
- Cart styling is now configurable through the `cartConfig.js` file
- Cart is in modal for both Android and iOS devices
- Use UIWebView for Appium tests until Appium supports WKWebView

## v0.8.0
- Update to use backButtonPressed event and ensure application closes at appropriate times in Android.
- Added automated system tests

## v0.7.1
- Astro no longer uses grunt-harp

## v0.7.0
- Update to reference Astro via npm

## v0.6.0
- Add a navigationController, tabBarController and DrawerController.
- Move DeepLinking configuration to a service.
- Enable different UI for android and iOS
- Add a cart in a modal for iOS and in a drawer for android

## v0.5.0
- Uses 0.5.0 of Astro
