# Setup

To get up and running with scaffold, ensure the dependancies are installed:

    npm run-script install-dependencies

**Note**: The `app/build-js.sh` script automatically builds app.js.
If node.js isn't installed to /usr/local/bin, run:

    cp app/user-env.sh.example app/user-env.sh && which npm | sed 's/\/npm//' | pbcopy

Then paste the npm path from your clipboard onto the end of the path inside of the user-env.sh file.

# Android

Import the scaffold into Android Studio using the Import Project option and by selecting the
`astro-scaffold` directory, and then hit "Run".

# iOS

Run the following command to open the iOS scaffold in Xcode:

    open ios/scaffold.xcworkspace

# Updating to the latest Astro

Astro is brought in as a submodule. To update the Astro submodule to point to correct commit (ie. latest ‘develop’)
- `cd astro`
- `git checkout develop`
- `git pull`
- `cd ..`
- `npm run-script install-dependencies`
- `git add astro`
- `git commit -m "Updating Astro submodule to latest on 'develop' branch."`

# Developing Astro from within your project

If you are making changes to Astro and testing them from within this project,
`app/build-js.js` will detect if the `astro` submodule has been modified. If it has,
it will automatically build `astro-client.js` and copy it into your project.

# Switching between Debug and Release mode

## iOS

Xcode - Product > Scheme > Edit Scheme ... In the Run scheme, change Build Configuration to Release

## Android

Android Studio - View > Tool Windows > Build Variants ... In the Build Variants panel, switch scaffold and astro to release.

# Getting Started

Open `app/app.js` to get started with development on this project!

## Controller Architecture

Astro uses a controller pattern to manage the business logic of UI components. Controllers can manage a single Astro plugin or coordinate the behavior of several astro plugins which make up a single UI component in the app.

Astro defines a controller inside of a requirejs module. The module exposes a prototype object as well as a factory method (`init`) which can be used to instantiate controllers with the prototype. The `init` method returns a promise which resolves to the newly created object.

## App Structure

* `app/app.js` is the entry point of the App
* `app/scaffold-components/` contains configuration files and helper objects which allow the app to maintain a clean architecture
  * `app/scaffold-components/deepLinkingServices.js` allows the app to configure deep linking functionality
  * `app/scaffold-components/headerConfig.js` configure the header styles and icons
  * `app/scaffold-components/menuConfig.js` configure the menu items
* `app/scaffold-controllers/` contains controller objects which manage the business logic of the UI components
  * `app/scaffold-controllers/cartController.js` manages the webview which contains the cart page
  * `app/scaffold-controllers/cartHeaderController.js` manages the header bar which is displayed in the cart modal
  * `app/scaffold-controllers/cartModalController.js` manages the cart modal which contains a header bar and the cart webview
  * `app/scaffold-controllers/drawerController.js` manages the drawer layout which is used in the Android version of the app. Coordinates behavior between the menu in the left drawer, navigation components in the main content view of the drawer and the cart in the right drawer.
  * `app/scaffold-controllers/navigationController.js` manages the navigation component for a menu item. Coordinates behavior between the navigation plugin and the header bar for the menu item.
  * `app/scaffold-controllers/navigationHeaderController.js` manages the header bars which are displayed in the navigation components
  * `app/scaffold-controllers/tabBarController.js` manages the tab bar layout which is used in the iOS version of the app. Coordinates the behavior of the tab bar buttons, navigation components and the cart which is displayed in a modal view.
* `app/scaffold-www/` contains html/css/js files needed for the apps embedded webpages - allows for these pages to be accessible offline
  * `app/scaffold-www/left-menu.html` ui for the Android app's left menu

# Running Tests

The scaffold comes with an example appium test located in app/tests/system/
The tests depend on appium. Install it:

    npm install -g appium

By default, the tests run on the iOS 8.3 simulator. Make sure this is installed by going to Xcode > Preferences > Downloads.    

![Screenshot of Xcode Downloads](https://s3.amazonaws.com/uploads.hipchat.com/15359/58433/YSrQpl7NyZEown6/2015-08-12%2011.59.00%20am.png)

You may also have to authorize the ios simulator to run your application using appium:

    sudo authorize_ios

(Optional) Install xcpretty to format the output from xcodebuild

    gem install xcpretty    

To run the tests, execute the following command from the root directory of the repo:

    npm test

### Specify Test Device Version

To specify the version you want to test against, edit the `scripts/ios-appium.sh` script and
change the `-destination` argument to point at the desired device and version. You must also
update the `nightwatch-config.js` file inside of `app/tests/system`. Make sure the desired capabilities
of the nightwatch config file match the device version you specify in the bash script.

# CircleCI Setup:
- (iOS only) Update the files in `circle/certificates` and `circle/provisioning-profiles` if you have non-Mobify certificates and provision profiles.
- (iOS only) Update the config files in `circle/config` based on the updates made in the previous step
- **Follow** GitHub repo in CircleCI
- In **Experimental Settings** enable **Build iOS Project**
- In **Environment Variables** make sure to set:
    - `HOCKEYAPP_TOKEN` and `HOCKEYAPP_TOKEN_ANDROID` - See HockeyApp Setup below to get this
    - KEY_PASSWORD - Passwords for the .p12 files are in "CI Development Key" of the "Shared-App Credentials" folder in LastPass.
- You will need to make sure CircleCI can access the Astro repo (for Mobify projects, follow [these instructions](https://mobify.atlassian.net/wiki/display/LT/questions/79528346/i-am-creating-a-new-cst-mobile-build-ios-or-android-that-has-linked-in-astro-as-a-git-submodule.-how-do-grant-circleci-access-to-both-repos)).

# HockeyApp Setup
- Make sure there is an iOS project created with bundle identifier: `com.mobify.astro.scaffold`
- Make sure there is an Android project created with package name: `com.mobify.astro.scaffold`
- For iOS, create a `HOCKEYAPP_TOKEN` key in Account Settings -> API Tokens. Copy & Paste the token into the `HOCKEYAPP_TOKEN` environment variable in CircleCI described in   
- For Android, create a `HOCKEYAPP_TOKEN_ANDROID` key in Account Settings -> API Tokens. Copy & Paste the token into the `HOCKEYAPP_TOKEN_ANDROID` environment variable in CircleCI described in   
 the above section CircleCI Setup



# Troubleshooting

![Screenshot of no available devices error](https://s3.amazonaws.com/uploads.hipchat.com/15359/58433/ACnytly3S1nHHkb/2015-08-12%2011.59.25%20am.png)

You need to install the correct OS version of the iOS simulator. See "Running tests" above.
