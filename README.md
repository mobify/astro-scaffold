# Setup

## Requirements

- [Git](https://git-scm.com/)
- We recommend you use [nvm](https://github.com/creationix/nvm#installation) to
manage node and npm versions.
- node ^4.0.0 LTS
- npm ^2.0.0

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
    sed -i '' '/export PATH="/d' app/user-env.sh && \
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

## Quick Configuration

The scaffold project contains configuration files located under `app/app-config/` that you can modify for quick customizations.

## Enabling Mobify Preview

To enable Mobify Preview for Adaptive.js and Mobify.js projects, go into the `baseConfig.js` file, set `previewEnabled = true`, and specify a bundle to preview `previewBundle` (i.e. http://localhost:8443/adaptive.js).

## Controller Architecture

Astro uses a controller pattern to manage the business logic of UI components. Controllers can manage a single Astro plugin or coordinate the behavior of several astro plugins which make up a single UI component in the app.

Astro defines a controller inside of a requirejs module. The module exposes a prototype object as well as a factory method (`init`) which can be used to instantiate controllers with the prototype. The `init` method returns a promise which resolves to the newly created object.

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

# Universal Deep Linking iOS

In order for the iOS app to support universal deep linking. The site which will be deeplinked from needs to host a `apple-app-site-association` file. The scaffold includes an example of this file at `ios/scaffold/apple-app-site-association`. Please see [Universal Linking Setup](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html) for more information.

# Troubleshooting

![Screenshot of no available devices error](https://s3.amazonaws.com/uploads.hipchat.com/15359/58433/ACnytly3S1nHHkb/2015-08-12%2011.59.25%20am.png)

You need to install the correct OS version of the iOS simulator. See "Running tests" above.
