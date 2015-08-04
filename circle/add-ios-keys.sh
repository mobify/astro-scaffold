#!/bin/bash -eu

MYDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

KEYCHAIN_PASSWORD=circleci

security create-keychain -p $KEYCHAIN_PASSWORD ios-build.keychain
security import "$MYDIR/AppleWWDRCA.cer" -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
security import "$MYDIR/mobify-ios-distribution.cer" -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
security import "$MYDIR/ci-development-key.p12" -k ~/Library/Keychains/ios-build.keychain -P "$KEY_PASSWORD" -T /usr/bin/codesign

security list-keychain -s ~/Library/Keychains/ios-build.keychain
security unlock-keychain -p "$KEYCHAIN_PASSWORD" ~/Library/Keychains/ios-build.keychain

mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp "$MYDIR"/*.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/
