#!/bin/bash -eu

MYDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT=$MYDIR/..

if [ $# -ne 1 ]; then
    echo usage: "$(basename "$0")" config
    exit 1
fi

CONFIG=$1

source "$ROOT/circle/config/$CONFIG"

PROVISIONING_PROFILE="$HOME/Library/MobileDevice/Provisioning Profiles/$PROVISIONING_PROFILE_NAME"
RELEASE_DATE=$(date '+%Y-%m-%d %H:%M:%S')
APP_DIR="$ARCHIVE_PATH/Products/Applications"
DSYM_DIR="$ARCHIVE_PATH/dSYMs"

echo "********************"
echo "*     Archive      *"
echo "********************"
xcodebuild -scheme "$XCODE_SCHEME" -workspace "$XCODE_WORKSPACE" -configuration "$XCODE_CONFIGURATION" -archivePath "$ARCHIVE_PATH" clean archive CODE_SIGN_IDENTITY="$CODE_SIGN_IDENTITY" BUNDLE_VERSION="$BUNDLE_VERSION"

echo "********************"
echo "*     Signing      *"
echo "********************"
xcrun -log -sdk iphoneos PackageApplication "$APP_DIR/$APPNAME.app" -o "$APP_DIR/$APPNAME.ipa" -sign "$CODE_SIGN_IDENTITY" -embed "$PROVISIONING_PROFILE"

RELEASE_NOTES="Build: $BUNDLE_VERSION  Uploaded: $RELEASE_DATE"

zip -r -9 "$DSYM_DIR/$APPNAME.app.dSYM.zip" "$DSYM_DIR/$APPNAME.app.dSYM"

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
    -H "X-HockeyAppToken: $HOCKEYAPP_TOKEN"          \
    -F ipa="@$APP_DIR/$APPNAME.ipa"                  \
    -F dsym="@$DSYM_DIR/$APPNAME.app.dSYM.zip"       \
    -F notes="$RELEASE_NOTES"                        \
    -F notes_type=1                                  \
    -F notify=1                                      \
    -F status=2                                      \
    -F mandatory=0                                   \
    -F release_type=0                                \
    -F commit_sha="$CIRCLE_SHA1"
