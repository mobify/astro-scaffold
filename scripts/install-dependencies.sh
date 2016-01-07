#!/bin/bash -eu

# Ensure the astro submodule is loaded correctly
git submodule update --init

# Install dependancies in `app`
pushd app
npm install
popd

# Install dependancies in `astro`
pushd astro
npm install
popd
