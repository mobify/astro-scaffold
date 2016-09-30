#!/bin/bash

# Add navitron & its dependencies to the app bundle
cp $MYPATH/node_modules/grunt-requirejs/node_modules/requirejs/require.js $MYPATH/app/app-www/js/build
cp $MYPATH/node_modules/navitron/node_modules/plugin/dist/plugin*.js $MYPATH/app/app-www/js/build
cp $MYPATH/node_modules/navitron/node_modules/velocity-animate/velocity.* $MYPATH/app/app-www/js/build
cp $MYPATH/node_modules/navitron/dist/navitron*.js $MYPATH/app/app-www/js/build

cp $MYPATH/node_modules/jquery/dist/jquery.min.js $MYPATH/app/app-www/js/build
