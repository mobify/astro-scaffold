#!/bin/bash -eu

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

pushd ios/
xcodebuild \
    -workspace "scaffold.xcworkspace/" \
    -scheme "scaffold" \
    -destination "platform=iOS Simulator,name=iPhone 6,OS=8.3" \
    -derivedDataPath "build" \
    build | prettifyOutput
popd

pushd app/
grunt nightwatch -e ios-sim
