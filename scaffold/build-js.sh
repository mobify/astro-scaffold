#!/bin/bash

# This script is to be executed by Gradle.

# Android studio launches Gradle in a subprocess that doesn't inherrit your
# environment variables. This blows up when we expect some command like 'grunt'
# to be available in your PATH. Source all files that typically update the PATH
# to ensure that Gradle has the same PATH as your usual terminal.
source ~/.zshrc
source ~/.bashrc
source ~/.bash_profile

set -e

# The CWD when invoked by Gradle ends up as `scaffold`.
pushd ..

# Install root package.json.
npm install

# Build app.js.
cd app
npm install
grunt build

popd
