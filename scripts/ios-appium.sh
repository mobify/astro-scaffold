#!/bin/bash -eu

set -o pipefail
 
MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd ) 
ROOT=$MYPATH/..
export IOS_DEVICE_NAME="iPhone 6"
export IOS_VERSION="9.2"

# Kill background processes when this script exits.
trap 'kill $(jobs -p)' EXIT

function prettifyOutput() {
    # xcpretty makes output nicer
    if which xcpretty 2>/dev/null; then
        xcpretty -t
    else
        cat
    fi
}

appium --log-level error &

pushd $ROOT/ios/
xcodebuild \
    -workspace "scaffold.xcworkspace/" \
    -scheme "scaffold" \
    -configuration "Release" \
    -destination "platform=iOS Simulator,name=$IOS_DEVICE_NAME,OS=$IOS_VERSION" \
    -derivedDataPath "build" \
    build | prettifyOutput
popd

pushd $ROOT/app/
grunt nightwatch
