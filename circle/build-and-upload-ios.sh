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

ARCHIVE_PATH="$ROOT/build/Astro-Sandbox.xcarchive"
SOURCE_INFO_PLIST="$ARCHIVE_PATH/Info.plist"
APP_DIR="$ARCHIVE_PATH/Products/Applications"
DSYM_DIR="$ARCHIVE_PATH/dSYMs"

function makeWorkingDirectory() {
    WORKING_DIR=$(mktemp -d /tmp/astro-sandbox-ios.XXXXX)
    #trap 'rm -rf $WORKING_DIR' EXIT
}

function updatePaths() {
    if [ ! -d $ROOT/build/$CONFIG_NAME ]; then
        mkdir -p "$ROOT/build/$CONFIG_NAME/"
    fi
    IPA_PATH="$ROOT/build/$CONFIG_NAME/Astro-Sandbox.ipa"
    PROVISIONING_PROFILE="$HOME/Library/MobileDevice/Provisioning Profiles/$PROVISIONING_PROFILE_NAME"
}

function prettifyOutput() {
    # xcpretty makes output nicer
    if which xcpretty 2>/dev/null; then
        xcpretty -t
    else
        cat
    fi
}

function buildAndArchive() {

    echo "**********************************$(seq -f "*" -s "" ${#ARCHIVE_PATH})"
    echo "*     Build and Archive to $ARCHIVE_PATH      *"
    echo "**********************************$(seq -f "*" -s "" ${#ARCHIVE_PATH})"
    xcodebuild  archive \
        -scheme "$XCODE_SCHEME" \
        -workspace "$XCODE_WORKSPACE" \
        -configuration "$XCODE_CONFIGURATION" \
        -archivePath "$ARCHIVE_PATH" \
        CODE_SIGN_IDENTITY="$CODE_SIGN_IDENTITY" \
        BUNDLE_VERSION="$BUNDLE_VERSION" \
        | prettifyOutput
}

function packageApp() {
    echo "*********************$(seq -f "*" -s "" ${#CONFIG})"
    echo "*     Packaging $CONFIG    *"
    echo "*********************$(seq -f "*" -s "" ${#CONFIG})"
    xcrun -sdk iphoneos -log \
        PackageApplication "$APP_DIR/$APPNAME.app" \
        -o "$IPA_PATH" \
        -sign "$CODE_SIGN_IDENTITY" \
        -embed "$PROVISIONING_PROFILE"
}

function uploadToHockeyApp() {

    echo "********************$(seq -f "*" -s "" ${#IPA_PATH})"
    echo "*    Uploading $IPA_PATH    *"
    echo "********************$(seq -f "*" -s "" ${#IPA_PATH})"

    zip -q -r -9 "$DSYM_DIR/$APPNAME.app.dSYM.zip" "$DSYM_DIR/$APPNAME.app.dSYM"

    # See http://support.hockeyapp.net/kb/api/api-apps for parameter details

    # notes_type=1      Markdown
    # notify=1          Notify testers, 0=don't notify
    # status=2          Make the version available for download, 1=don't allow
    # mandatory=0       Not mandatory
    # release_type=0    Beta

    echo "Uploading to HockeyApp (token $HOCKEYAPP_TOKEN) "
    curl https://rink.hockeyapp.net/api/2/apps/upload    \
        --progress-bar                                   \
        -o /dev/null                                     \
        -H "X-HockeyAppToken: $HOCKEYAPP_TOKEN"          \
        -F ipa="@$IPA_PATH"                              \
        -F dsym="@$DSYM_DIR/$APPNAME.app.dSYM.zip"       \
        -F notes="$RELEASE_NOTES"                        \
        -F notes_type=1                                  \
        -F notify=0                                      \
        -F status=2                                      \
        -F mandatory=0                                   \
        -F release_type=$HOCKEYAPP_RELEASE_TYPE          \
        -F commit_sha="$CIRCLE_SHA1"
}

function resignApp() {

    echo "**************************$(seq -f "*" -s "" ${#ARCHIVE_PATH})"
    echo "*    Resigning app in $ARCHIVE_PATH    *"
    echo "**************************$(seq -f "*" -s "" ${#ARCHIVE_PATH})"

    PAYLOAD_DIR="$WORKING_DIR/Payload"
    mkdir -p "$PAYLOAD_DIR"

    APP_PATH=$(/usr/libexec/PlistBuddy "$SOURCE_INFO_PLIST" -c "Print :ApplicationProperties:ApplicationPath")

    # Copy .app to payload directory
    SOURCE_APP_PATH="$ARCHIVE_PATH/Products/$APP_PATH"
    PAYLOAD_APP_PATH="$PAYLOAD_DIR/$(basename "$APP_PATH")"
    cp -r "$SOURCE_APP_PATH" "$PAYLOAD_APP_PATH"

    # Change BundleID if it's specified
    if [ "$BUNDLE_ID" != "" ]; then
        /usr/libexec/PlistBuddy "$PAYLOAD_APP_PATH/Info.plist" -c "Set :CFBundleIdentifier $BUNDLE_ID"

        if [ -f $PAYLOAD_DIR/iTunesMetadata.plist ]; then
            /usr/libexec/PlistBuddy "$PAYLOAD_DIR/iTunesMetadata.plist" -c "Set :CFBundleIdentifier $BUNDLE_ID"
        fi
    fi

    # Update provisioning profile
    rm -f "$PAYLOAD_APP_PATH/embedded.mobileprovision"
    cp "$PROVISIONING_PROFILE" "$PAYLOAD_APP_PATH/embedded.mobileprovision"

    # Fix entitlements
    ENTITLEMENTS_FILE="$WORKING_DIR/entitlements.plist"
    NEW_ENTITLEMENTS_FILE=$(mktemp -t entitlementsXXXX.plist)

    /usr/bin/security cms -D -i "$PROVISIONING_PROFILE" > "$NEW_ENTITLEMENTS_FILE"
    /usr/libexec/PlistBuddy "$NEW_ENTITLEMENTS_FILE" -x -c "Print :Entitlements" > $ENTITLEMENTS_FILE

    if [ "$IS_APP_STORE_BUILD" == "1" ]; then
        echo "***** APP STORE BUILD *****"

        # Modify entitlements for App Store release
        TEAM_IDENTIFIER=$(/usr/libexec/PlistBuddy $ENTITLEMENTS_FILE -c "Print :application-identifier")
        TEAM_IDENTIFIER=$(echo $TEAM_IDENTIFIER | cut -d "." -f 1)
        /usr/libexec/PlistBuddy "$ENTITLEMENTS_FILE" -c "Delete :beta-reports-active" || true
        /usr/libexec/PlistBuddy "$ENTITLEMENTS_FILE" -c "Delete :com.apple.developer.team-identifier" || true
        /usr/libexec/PlistBuddy "$ENTITLEMENTS_FILE" -c "Delete :keychain-access-groups" || true
        /usr/libexec/PlistBuddy "$ENTITLEMENTS_FILE" -c "Add :keychain-access-groups array" || true
        /usr/libexec/PlistBuddy "$ENTITLEMENTS_FILE" -c "Add :keychain-access-groups:0 string $TEAM_IDENTIFIER.$BUNDLE_ID" || true
    fi

    # For OSX 10.9 and later, code signing requires a version 2 signature.
    # The resource envelope is obsolete.
    # To ensure it is ignored, remove the resource key from the Info.plist file.
    # The "|| true" on the end prevents the script from existing if :CFBundleResourceSpecification doesn't exist in the file.
    /usr/libexec/PlistBuddy "$PAYLOAD_APP_PATH/Info.plist" -c "Delete :CFBundleResourceSpecification" || true

    # Now sign, then verify, the bundle
    CODE_SIGN_RESULT=$(/usr/bin/codesign -fs "$CODE_SIGN_IDENTITY" --no-strict --deep --entitlements="$ENTITLEMENTS_FILE" "$PAYLOAD_APP_PATH")
    CODE_SIGN_VERIFY=$(/usr/bin/codesign -v "$PAYLOAD_APP_PATH")

    if [ "$CODE_SIGN_VERIFY" != "" ]; then
        echo "Code sign result: $CODE_SIGN_RESULT"
        echo "Verify output: $CODE_SIGN_VERIFY"
        exit
    fi

    ##
    ## Re-zip to create new .IPA
    ##
    pushd $WORKING_DIR
    /usr/bin/zip -qry "$IPA_PATH" Payload iTunesArtwork
    popd
}

# Now the actual work...
updatePaths
makeWorkingDirectory
buildAndArchive
packageApp
# We still re-sign the app because the Xcode project might
# not be configured with the bundle ID of the current config.
resignApp
uploadToHockeyApp

# We use the same .xcarchive now to re-sign for different environments
for CONFIG in "$@"
do
    source "$ROOT/$CONFIG"

    updatePaths
    resignApp
    uploadToHockeyApp
done

echo "************************************"
echo "*    Build and Upload complete!    *"
echo "************************************"
