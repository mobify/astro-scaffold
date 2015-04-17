#!/bin/bash
set -e

# Build app.js.
pushd ../app
npm install
grunt build
popd
