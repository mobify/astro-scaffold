#!/bin/bash -eu

set -o pipefail

MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

KEYCHAIN_PASSWORD=circleci

security create-keychain -p $KEYCHAIN_PASSWORD ios-build.keychain

# Extend keychain timeout so it doesn't reprompt during build
security set-keychain-settings -lut 7200 ios-build.keychain

# Apple's CA certificate
security import "$MYPATH/certificates/AppleWWDRCA.cer" -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign

# Mobify's distribution certificate and private key
security import "$MYPATH/certificates/mobify-ios-distribution.cer" -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
security import "$MYPATH/certificates/ci-development-key.p12" -k ~/Library/Keychains/ios-build.keychain -P "$KEY_PASSWORD" -T /usr/bin/codesign

# Set the search list to our temporary keychain
security list-keychains -s ~/Library/Keychains/ios-build.keychain

# Unlock the keychain for the build step
security unlock-keychain -p $KEYCHAIN_PASSWORD ~/Library/Keychains/ios-build.keychain

mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp "$MYPATH/provisioning-profiles/"*.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/
