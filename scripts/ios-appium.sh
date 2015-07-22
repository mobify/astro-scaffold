#!/bin/bash -eu

# Kill background processes when this script exits.
trap 'kill $(jobs -p)' EXIT

appium &

pushd ios/
xcodebuild \
    -workspace "scaffold.xcworkspace/" \
    -scheme "scaffold" \
    -destination "platform=iOS Simulator,name=iPhone 6,OS=8.4" \
    -derivedDataPath "build" \
    build
popd

pushd app/
grunt nightwatch -e ios-sim
