# Setup

```
mkdir your-project-name && cd your-project-name
git init
git pull git@github.com:mobify/astro-scaffold.git --depth 1
git submodule update --init
```

- The app/build-js.sh script automatically builds app.js.
- If node.js isn't installed to /usr/local/bin, run:

```
cp app/user-env.sh.example app/user-env.sh && which npm | pbcopy
```

Then paste the npm path from your clipboard onto the end of the path inside of the user-env.sh file.

# Android

- Import the scaffold into Android Studio using the Import Project option and by selecting the `astro-scaffold` directory.
- Hit run, celebrate with a delicious beer!

# iOS
- run the following command to open the iOS scaffold in Xcode:

```
open ios/scaffold/scaffold.xcworkspace
```

## Customizing the project
* Change the app target name from "scaffold" to "ios-app"
* Change the app test target name from "scaffoldTest" to "ios-appTest"
* Change Bundle Identifier prefix from "com.mobify.astro" to your client company's reverse domain name (ie. `com.thinkgeek`).  The full Bundle Identifier should now be “com.thinkgeek.ios-app”.
* Open `app.js` and change the `baseUrl` variable to be your client company’s “homepage” for the app (ie. `www.thinkgeek.com`)
* Change the "Product Name" under the "Packaging" section in Build Settings to what you want the app to be named on the iOS home screen (ie. `ThinkGeek`).
* Update the Astro submodule to point to correct commit (ie. latest ‘develop’)
  * `cd astro`
  * `git checkout develop`
  * `git pull`
  * `cd ..`
  * `git add astro`
  * `git commit -m "Updating Astro submodule to latest on 'develop' branch."`

## Running Tests
The scaffold comes with an example appium test located in app/tests/system/
The tests depend on appium. Install it:

```
npm install -g appium
```

You may also have to authorize the ios simulator to run your application using appium:

```
sudo authorize_ios
```

To run the tests, execute the following command from the root directory of the repo:
```
npm test
```
