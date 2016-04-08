# Setup

To get up and running with scaffold, ensure the dependencies are installed:

```bash
npm install
```

During the first build in Xcode or Android Studio, the npm dependencies for astro-sdk are installed. This takes some time, so you can install them manually:

```bash
pushd node_modules/astro-sdk && npm install && popd
```

**Note**: The `app/build-js.sh` script automatically builds app.js.

If node.js isn't installed in `/usr/local/bin`, run:

```bash
cp app/user-env.sh.example app/user-env.sh && \
    sed -i '' '/export PATH="/d"' app/user-env.sh && \
    echo "export PATH=\$PATH:\"$(which npm | sed 's/\/npm//')\"" >> app/user-env.sh && \
    chmod +x app/user-env.sh
```

# Android

Import the scaffold into Android Studio using the Import Project option and by selecting the
`astro-scaffold` directory, and then hit "Run".

# iOS

Run the following command to open the iOS scaffold in Xcode:

```bash
open ios/scaffold.xcworkspace
```

# Developing against `develop` of Astro

Clone Astro (note: Astro is not open on GitHub, to gain access please contact
the Astro team)

```bash
git clone git@github.com:mobify/astro.git
cd astro
npm link
```

Then navigate back to your project root directory and run: `npm link astro-sdk`
to use your locally developed version of Astro.

# Switching between Debug and Release mode

## iOS

Xcode - Product > Scheme > Edit Scheme ... In the Run scheme, change *Build Configuration* to Release

## Android

Android Studio - View > Tool Windows > Build Variants ... In the Build Variants panel, switch scaffold and astro to release.

# Getting Started

Open `app/app.js` to get started with development on this project!

## Controller Architecture

Astro uses a controller pattern to manage the business logic of UI components. Controllers can manage a single Astro plugin or coordinate the behavior of several astro plugins which make up a single UI component in the app.

Astro defines a controller inside of a requirejs module. The module exposes a prototype object as well as a factory method (`init`) which can be used to instantiate controllers with the prototype. The `init` method returns a promise which resolves to the newly created object.

## App Structure

* `app/app.js` is the entry point of the App
* `app/global` contains files that provide a common interface for communication between controller objects
  * `app/global/app-events.js` is an event bus that is used to communicate between app components
  * `app/global/app-rpc.js` is an RPC bus that contains registered methods exposed to Astro
* `app/app-config/` contains configuration files aiding in the centralization of app styling and content customization
  * `app/app-config/baseConfig.js` configures application-level styling & content
  * `app/app-config/cartConfig.js` configures modal cart styling & content
  * `app/app-config/errorConfig.js` configures error modal styling & content
  * `app/app-config/headerConfig.js` configures header styling & icon
  * `app/app-config/menuConfig.js` configures left drawer menu items
  * `app/app-config/searchConfig.js` configures search bar
  * `app/app-config/tabConfig.js` configures tab bar items
  * `app/app-config/welcomeConfig.js` configures welcome modal styling & content
* `app/app-components/` contains helper objects which allow the app to maintain a clean architecture
  * `app/app-components/deepLinkingServices.js` allows the app to configure deep linking functionality
* `app/app-controllers/` contains controller objects which manage the business logic of the UI components
  * `app/app-controllers/cart` contains controller objects which manage the cart modal logic
    * `app/app-controllers/cart/cartController.js` manages the webview which contains the cart page
    * `app/app-controllers/cart/cartHeaderController.js` manages the header bar which is displayed in the cart modal
    * `app/app-controllers/cart/cartModalController.js` manages the cart modal which contains a header bar and the cart webview
  * `app/app-controllers/error-screen` contains the controller object which manages error modal logic
    * `app/app-controllers/errorController.js` manages event handling for triggered errors
  * `app/app-controllers/welcome-screen` contains controller objects which manage welcome modal logic
    * `app/app-controllers/welcome-screen/welcomeController.js` manages the navigation and layout of the welcome screen
    * `app/app-controllers/welcome-screen/welcomeHeaderController.js` manages the header bar which is displayed in the welcome screen
    * `app/app-controllers/welcome-screen/welcomeModalController.js` manages the modal logic for the welcome screen
  * `app/app-controllers/doubleIconsController.js` coordinates a set of double icon plugins. Ensures the icons displayed in all the double icon plugins stay in-sync.
  * `app/app-controllers/drawerController.js` manages the drawer layout which is used in the Android version of the app. Coordinates behavior between the menu in the left drawer, navigation components in the main content view of the drawer and the cart in the right drawer.
  * `app/app-controllers/navigationController.js` manages the navigation component for a menu item. Coordinates behavior between the navigation plugin and the header bar for the menu item.
  * `app/app-controllers/navigationHeaderController.js` manages the header bars which are displayed in the navigation components
  * `app/app-controllers/searchBarController.js` manages the search bar. Allows the search bar to hide and show in a parent view. Allows search request to be handled by the app.
  * `app/app-controllers/tabBarController.js` manages the tab bar layout which is used in the iOS version of the app. Coordinates the behavior of the tab bar buttons, navigation components and the cart which is displayed in a modal view.
* `app/app-www/` contains assets/css/html/js files needed for the apps embedded webpages - allows for these pages to be accessible offline
  * `app/app-www/assets/` contains assets for embedded web content
  * `app/app-www/css/` contains style sheets for embedded web content
  * `app/app-www/html/` contains html files for embedded web content
  * `app/app-www/js/` contains JavaScript files for embedded web content

# Running Tests

The scaffold comes with an example appium test located in app/tests/system/
The tests depend on appium. Install it:

```bash
npm install -g appium
```

By default, the tests run on the simulator version specified in `scripts/ios-appium.sh`. Here you can change the device/iOS version to the combination you want to run the tests against. Make sure the specified version is installed on your machine by going to Xcode > Preferences > Downloads.

![Screenshot of Xcode Downloads](https://s3.amazonaws.com/uploads.hipchat.com/15359/58433/YSrQpl7NyZEown6/2015-08-12%2011.59.00%20am.png)

You may also have to authorize the ios simulator to run your application using appium:

```bash
sudo authorize_ios
```

(Optional) Install xcpretty to format the output from xcodebuild

```bash
gem install xcpretty
```

To run the tests, execute the following command from the root directory of the repo:

```bash
npm test
```

# CircleCI Setup:
- (iOS only) Add/Update the files in `circle/certificates` and `circle/provisioning-profiles` if you have non-Mobify certificates and provision profiles.
- (iOS only) Add/Update the config files in `circle/config` based on the updates made in the previous step
- **Follow** GitHub repo in CircleCI
- In **Experimental Settings** enable **Build iOS Project**
- In **Environment Variables** make sure to set:
    - `HOCKEYAPP_TOKEN` and `HOCKEYAPP_TOKEN_ANDROID` - See HockeyApp Setup below to get this
    - `KEY_PASSWORD` - Passwords for the .p12 files are in "CI Development Key" of the "Shared-App Credentials" folder in LastPass.

# HockeyApp Setup
- Make sure there is an iOS project created with bundle identifier: `com.mobify.astro.scaffold`
- Make sure there is an Android project created with package name: `com.mobify.astro.scaffold`
- For iOS, create a `HOCKEYAPP_TOKEN` key in Account Settings -> API Tokens. Copy & Paste the token into the `HOCKEYAPP_TOKEN` environment variable in CircleCI described in
- For Android, create a `HOCKEYAPP_TOKEN_ANDROID` key in Account Settings -> API Tokens. Copy & Paste the token into the `HOCKEYAPP_TOKEN_ANDROID` environment variable in CircleCI described in
 the above section CircleCI Setup

# Troubleshooting

![Screenshot of no available devices error](https://s3.amazonaws.com/uploads.hipchat.com/15359/58433/ACnytly3S1nHHkb/2015-08-12%2011.59.25%20am.png)

You need to install the correct OS version of the iOS simulator. See "Running tests" above.
