#!/bin/bash

pushd ios/scaffold/
xcodebuild \
    -workspace "scaffold.xcworkspace/" \
    -scheme "scaffold" \
    -destination "platform=iOS Simulator,name=iPhone 6,OS=8.4" \
    -derivedDataPath "build" \
    clean build
popd

appium &
APPIUM_PID=$!

sleep 5

pushd app/
grunt nightwatch -e ios-sim
RESULT=$!

kill $APPIUM_PID
exit $RESULT
