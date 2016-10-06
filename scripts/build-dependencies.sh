#!/bin/bash

set -e

function findNode() {
    return $(which npm 1>/dev/null 2>&1)
}

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    --no-color)
    NOCOLOR=true
    ;;
    *) # If it wasn't --no-color, we assume it was the path of the root of the project
    SUPPLIED_APP_FOLDER_PATH=$key
    ;;
esac
shift
done

MYPATH=$( cd $SUPPLIED_APP_FOLDER_PATH && pwd )
ROOT=$MYPATH/..
EXTRA_NPM_ARGS=""

if [ "$MYPATH" = "" ] ; then
    echo "Build directory not specified, exiting."
    exit 1
fi

if [ "$NOCOLOR" = true ]; then
    EXTRA_NPM_ARGS="--no-color $EXTRA_NPM_ARGS"
fi

echo "MYPATH=$MYPATH"
echo "ROOT=$ROOT"

if [ ! -d $MYPATH/app-www/js/build ] ; then
    mkdir $MYPATH/app-www/js/build
fi

export MYPATH

echo "npm install at the project root"
pushd $ROOT
    npm install $EXTRA_NPM_ARGS
popd

echo "add navitron & its dependencies to the app bundle"
cp $MYPATH/node_modules/grunt-requirejs/node_modules/requirejs/require.js $MYPATH/app-www/js/build
cp $MYPATH/node_modules/navitron/node_modules/plugin/dist/plugin*.js $MYPATH/app-www/js/build
cp $MYPATH/node_modules/navitron/node_modules/velocity-animate/velocity.* $MYPATH/app-www/js/build
cp $MYPATH/node_modules/navitron/dist/navitron*.js $MYPATH/app-www/js/build
cp $MYPATH/node_modules/jquery/dist/jquery.min.js $MYPATH/app-www/js/build

echo "build astro-client.js"
pushd $ROOT/node_modules/astro-sdk
    npm install --no-progress --no-spin $EXTRA_NPM_ARGS
    $MYPATH/node_modules/grunt-cli/bin/grunt $EXTRA_GRUNT_ARGS build_astro_client
popd

echo "copy astro-client.js"
cp $MYPATH/node_modules/astro-sdk/js/build/astro-client.js $MYPATH/app-www/js/build

echo "SUCCESS: build dependencies"
