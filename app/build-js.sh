#!/bin/bash

set -e

MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

pushd "$MYPATH"

# Force supporting Homebrew installations of npm.
export PATH=$PATH:/usr/local/bin

# Source additional configuration from `user-env.sh` in Astro's root.
if [ -f user-env.sh ]; then
    echo "Found user-env.sh"
    source user-env.sh
fi

if ! which npm 1>/dev/null 2>&1; then
    echo "Cannot find 'npm'.  Please ensure 'npm' is in your PATH."
    exit 1
fi

# Build astro-client.js
pushd ../node_modules/astro-sdk
npm install
grunt build_astro_client
popd
cp ../node_modules/astro-sdk/js/build/astro-client.js scaffold-www/

# Build app.js.
grunt build
