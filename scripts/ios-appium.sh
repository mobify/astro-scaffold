#!/bin/bash -eu

set -o pipefail
 
MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd ) 
ROOT=$MYPATH/..

# Kill background processes when this script exits.
trap 'kill $(jobs -p)' EXIT

appium --log-level=error &

pushd $ROOT/ios/
xcodebuild \
    -workspace "scaffold.xcworkspace/" \
    -scheme "scaffold" \
    -destination "platform=iOS Simulator,name=iPhone 6,OS=8.4" \
    -derivedDataPath "build" \
    build
popd

pushd $ROOT/app/
grunt nightwatch -e ios-sim
