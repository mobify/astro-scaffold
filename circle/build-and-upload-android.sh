#!/bin/bash -eu

set -o pipefail

if [ $# -lt 1 ]; then
    echo "usage: $(basename "$0") build_config [additional_signing_configs ...]"
    exit 1
fi

MYPATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT=$MYPATH/..

# Process first config specified
CONFIG=$1
source "$ROOT/$CONFIG"
shift

RELEASE_DATE=$(date '+%Y-%m-%d %H:%M:%S')
RELEASE_NOTES="Build: $BUNDLE_VERSION
Uploaded: $RELEASE_DATE
Branch: $CIRCLE_BRANCH"
APP_DIR="$ROOT/$ANDROID_ROOT_FOLDER/$PROJECT_PATH/build/outputs/apk"

echo "********************"
echo "*      Build       *"
echo "********************"
pushd $ANDROID_ROOT_FOLDER
./gradlew assembleRelease
popd

RELEASE_NOTES="Build: $CI$CIRCLE_BUILD_NUM Branch: $CIRCLE_BRANCH Uploaded: $RELEASE_DATE"

echo "********************"
echo "*    Uploading     *"
echo "********************"

# See http://support.hockeyapp.net/kb/api/api-apps for parameter details

# notes_type=1      Markdown
# notify=1          Do not notify testers
# status=2          Make the version available for download
# mandatory=0       Not mandatory
# release_type=0    Beta

curl https://rink.hockeyapp.net/api/2/apps/upload -v \
    -H "X-HockeyAppToken: $HOCKEYAPP_TOKEN_ANDROID"  \
    -F ipa="@$APP_DIR/$APKFILENAME.apk"              \
    -F notes="$RELEASE_NOTES"                        \
    -F notes_type=1                                  \
    -F notify=0                                      \
    -F status=2                                      \
    -F mandatory=0                                   \
    -F release_type=$HOCKEYAPP_RELEASE_TYPE          \
    -F commit_sha="$CIRCLE_SHA1"
