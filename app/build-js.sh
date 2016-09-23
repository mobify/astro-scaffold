#!/bin/bash

set -e

MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT=$MYPATH/..
EXTRA_NPM_ARGS=""
EXTRA_GRUNT_ARGS=""

function findNode() {
    return $(which npm 1>/dev/null 2>&1)
}

if [ "$1" == "--no-color" ]; then
    EXTRA_NPM_ARGS="--no-color $EXTRA_NPM_ARGS"
    EXTRA_GRUNT_ARGS="--no-color $EXTRA_GRUNT_ARGS"
fi

pushd "$MYPATH"

# Force supporting Homebrew installations of npm.
export PATH=$PATH:/usr/local/bin

if ! findNode; then
    echo "Cannot find 'npm'. Trying via nvm..."
    # Find node with nvm
    if [ -d "$HOME/.nvm" ]; then
        echo " ↳  Found $HOME/.nvm  Sourcing and retrying build..."
        . "$HOME/.nvm/nvm.sh"
    fi
fi

if ! findNode; then
    echo "Cannot find 'npm'. Trying via user-env.sh..."
    # Source additional configuration from `user-env.sh` in Astro's root.
    if [ -f user-env.sh ]; then
        echo " ↳  Found user-env.sh  Sourcing and retrying build..."
        source user-env.sh
    fi
fi

if ! findNode; then
    echo "Cannot find 'npm'. Aborting. Add your npm path to \`user-env.sh\` and retry."
    exit 1
fi

# Add navitron & its dependencies to the app bundle
cp $MYPATH/node_modules/grunt-requirejs/node_modules/requirejs/require.js $MYPATH/app-www/js/build
cp $MYPATH/node_modules/navitron/node_modules/plugin/dist/plugin*.js $MYPATH/app-www/js/build
cp $MYPATH/node_modules/navitron/node_modules/velocity-animate/velocity.* $MYPATH/app-www/js/build
cp $MYPATH/node_modules/navitron/dist/navitron*.js $MYPATH/app-www/js/build

cp $ROOT/node_modules/jquery/dist/jquery.min.js $MYPATH/app-www/js/build

# Build astro-client.js
pushd $ROOT/node_modules/astro-sdk
npm install --no-progress --no-spin $EXTRA_NPM_ARGS
$MYPATH/node_modules/grunt-cli/bin/grunt $EXTRA_GRUNT_ARGS build_astro_client
cp js/build/astro-client.js $MYPATH/app-www/js/build
popd

# Build app.js.
pushd $MYPATH
$MYPATH/node_modules/grunt-cli/bin/grunt $EXTRA_GRUNT_ARGS build
popd
