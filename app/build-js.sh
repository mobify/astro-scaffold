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

# Build app.js.
grunt build

# If the astro submodule has been modified, assume the user is developing
# Astro from within the project, and build astro-client.js
if [ -z "$(git diff | grep dirty)" ] && [ -f ../app/scaffold-www/astro-client.js ]; then
    echo "No need to build astro-client"
    exit 0
fi
cd ../astro
grunt build_astro_client
cp js/build/astro-client.js ../app/scaffold-www/
popd
