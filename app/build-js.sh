#!/bin/bash

set -e

MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT=$MYPATH/..

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

# Add navitron & its dependencies to the app bundle
cp $ROOT/node_modules/navitron/dist/navitron.min.js $MYPATH/app-www/js
cp $ROOT/node_modules/navitron/node_modules/requirejs/require.js $MYPATH/app-www/js
cp $ROOT/node_modules/navitron/node_modules/plugin/dist/plugin.min.js $MYPATH/app-www/js
cp $ROOT/node_modules/navitron/node_modules/velocity-animate/velocity*.min.js $MYPATH/app-www/js

cp $ROOT/node_modules/jquery/dist/jquery.min.js $MYPATH/app-www/js

# Build astro-client.js
pushd $ROOT/node_modules/astro-sdk
npm install
$MYPATH/node_modules/grunt-cli/bin/grunt build_astro_client
cp js/build/astro-client.js $MYPATH/app-www/js
popd

# Build app.js.
$MYPATH/node_modules/grunt-cli/bin/grunt build
