# Setup

To get up and running with scaffold, ensure your submodules are up to date:

    git submodule update --init

**Note**: The app/build-js.sh script automatically builds app.js.
If node.js isn't installed to /usr/local/bin, run:

    cp app/user-env.sh.example app/user-env.sh && which npm | pbcopy

Then paste the npm path from your clipboard onto the end of the path inside of the user-env.sh file.

# Android

- Import the scaffold into Android Studio using the Import Project option and by selecting the
`astro-scaffold` directory, and then hit "Run".

# iOS
- Run the following command to open the iOS scaffold in Xcode:

    open ios/scaffold/scaffold.xcworkspace
