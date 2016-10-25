#!/bin/bash

set -e

echo "Setting up path variables and finding node"
MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
EXTRA_NPM_ARGS=""
EXTRA_GRUNT_ARGS=""

function findNode() {
    return $(which npm 1>/dev/null 2>&1)
}

if [ "$1" == "--no-color" ]; then
    EXTRA_NPM_ARGS="--no-color $EXTRA_NPM_ARGS"
    EXTRA_GRUNT_ARGS="--no-color $EXTRA_GRUNT_ARGS"
fi

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

echo "Building app.js"
pushd $MYPATH
    $MYPATH/node_modules/.bin/grunt $EXTRA_GRUNT_ARGS build
popd

echo "SUCCESS: build app.js"
