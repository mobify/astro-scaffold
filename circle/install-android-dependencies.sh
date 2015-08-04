#!/bin/bash

MYDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

brew tap caskroom/cask &&
brew install brew-cask &&
brew cask install java &&
brew install android-sdk &&
pushd $ANDROID_HOME &&
echo y | android update sdk -u -a -t platform-tools &&
echo y | android update sdk -u -a -t build-tools-21.1.2 &&
echo y | android update sdk -u -a -t android-21 &&
echo y | android update sdk -u -a -t extra-google-m2repository &&
echo y | android update sdk -u -a -t extra-android-support &&
echo y | android update sdk -u -a -t extra-android-m2repository &&
echo y | android update sdk -u -a -t extra-google-google_play_services &&
popd
