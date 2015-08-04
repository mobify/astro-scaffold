#!/bin/bash -eu

MYDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT=$MYDIR/..

if [ $# -ne 1 ]; then
    echo usage: "$(basename "$0")" config
    exit 1
fi

CONFIG=$1

source "$ROOT/circle/config/$CONFIG"

RELEASE_DATE=$(date '+%Y-%m-%d %H:%M:%S')
APP_DIR="$ROOT/$ANDROID_ROOT_FOLDER/$PROJECT_PATH/build/outputs/apk"

echo "********************"
echo "*      Build       *"
echo "********************"
pushd $ANDROID_ROOT_FOLDER
./gradlew assembleRelease
popd

RELEASE_NOTES="Build: Android  Uploaded: $RELEASE_DATE"

echo "********************"
echo "*    Uploading     *"
echo "********************"

# See http://support.hockeyapp.net/kb/api/api-apps for parameter details

# notes_type=1      Markdown
# notify=1          Notify testers
# status=2          Make the version available for download
# mandatory=0       Not mandatory
# release_type=0    Beta

curl https://rink.hockeyapp.net/api/2/apps/upload -v \
    -H "X-HockeyAppToken: $HOCKEYAPP_TOKEN_ANDROID"  \
    -F ipa="@$APP_DIR/$APKFILENAME.apk"              \
    -F notes="$RELEASE_NOTES"                        \
    -F notes_type=1                                  \
    -F notify=1                                      \
    -F status=2                                      \
    -F mandatory=0                                   \
    -F release_type=0                                \
    -F commit_sha="$CIRCLE_SHA1"
