# Setup

To get up and running with scaffold, ensure your submodules are up to date:

    git submodule update --init

**Note**: The app/build-js.sh script automatically builds app.js.
If node.js isn't installed to /usr/local/bin, run:

    cp app/user-env.sh.example app/user-env.sh && which npm | pbcopy

Then paste the npm path from your clipboard onto the end of the path inside of the user-env.sh file.

# Android

Import the scaffold into Android Studio using the Import Project option and by selecting the
`astro-scaffold` directory, and then hit "Run".

# iOS

Run the following command to open the iOS scaffold in Xcode:

    open ios/scaffold/scaffold.xcworkspace

# Updating to the latest Astro

Astro is brought in as a submodule. To update the Astro submodule to point to correct commit (ie. latest ‘develop’)
- `cd astro`
- `git checkout develop`
- `git pull`
- `cd ..`
- `git add astro`
- `git commit -m "Updating Astro submodule to latest on 'develop' branch."`

# Getting Started

Open `app/app.js` to get started with development on this project!

# Running Tests

The scaffold comes with an example appium test located in app/tests/system/
The tests depend on appium. Install it:

    npm install -g appium

You may also have to authorize the ios simulator to run your application using appium:

    sudo authorize_ios

To run the tests, execute the following command from the root directory of the repo:

    npm test

### Specify Test Device Version

To specify the version you want to test against, edit the `scripts/ios-appium.sh` script and
change the `-destination` argument to point at the desired device and version. You must also
update the `nightwatch-config.js` file inside of `app/tests/system`. Make sure the desired capabilities
of the nightwatch config file match the device version you specify in the bash script.

# iOS CI support

### CircleCI Setup:
- Update the files in `circle/certificates` and `circle/provisioning-profiles` as required
- Update the config files in `circle/config` based on the updates made in the previous step
- **Follow** GitHub repo in CircleCI
- In **Experimental Settings** enable **Build iOS Project**
- In **Environment Variables** make sure to set:
    - HOCKEYAPP_TOKEN - See HockeyApp Setup below to get this
    - KEY_PASSWORD - See `circle/README.md`

### HockeyApp Setup
- Make sure there is an iOS project created with bundle identifier: `com.astro.scaffold`
- In Account Settings->API Tokens, make sure there is an active `Upload & Release` API token for your app. Copy & Paste the token into the HOCKEYAPP_TOKEN environment variable in CircleCI described in the above section CircleCI Setup

# Android CI support
- **Follow** GitHub repo in CircleCI
- In **Experimental Settings** enable **Build iOS Project** (this is currently required)
- In **Environment Variables** make sure to set:
    - HOCKEYAPP_TOKEN - See HockeyApp Setup below to get this
    - KEY_PASSWORD - See `circle/README.md`

### HockeyApp Setup
- Make sure there is an Android project created with bundle identifier: `com.astro.scaffold`
- In Account Settings->API Tokens, make sure there is an active `Upload & Release` API token for your app. Copy & Paste the token into the HOCKEYAPP_TOKEN environment variable in CircleCI described in the above section CircleCI Setup
