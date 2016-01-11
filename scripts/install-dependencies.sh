#!/bin/bash -eu

# Ensure the astro submodule is loaded correctly
git submodule update --init

# Install dependencies in `app`
pushd app
npm install
popd

# Install dependencies in `astro`
pushd astro
npm install
popd
