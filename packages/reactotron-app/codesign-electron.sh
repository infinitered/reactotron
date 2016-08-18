#!/bin/bash
# Invoke this script with a relative '.app' path, for example:
# codesign-electron.sh "darwin-x64/Electron.app"

# 1. Run the following command to get a list of identities:
# security find-identity

# 2. Now set the value of the identity variable below to the identity you want to use:
identity=$REACTOTRON_CODESIDE_IDENTITY

app="$PWD/$1"

echo "Signing..."
# When you sign frameworks, you have to sign a specific version.
# For example, you have to sign "Electron Framework.framework/Versions/A"
# Signing the top level folder ("Electron Framework.framework") will fail.
# Signing "Electron Framework.framework/Versions/Current" will also fail (because it is a symbolic link).
# Apple recommends NOT using --deep, but rather signing each item explictly (which is how XCode does it).
# Other scripts sometimes resign items multiple times in the process because of --deep which is slow.
# The following signs the bare minimum needed to get Gatekeeper acceptance.
# If you renamed "Electron Helper.app",  "Electron Helper EH.app" and "Electron Helper NP.app" then rename below.
codesign --verbose --sign "$identity" "$app/Contents/Frameworks/Electron Framework.framework/Versions/A"
codesign --verbose --sign "$identity" "$app/Contents/Frameworks/Reactotron Helper EH.app"
codesign --verbose --sign "$identity" "$app/Contents/Frameworks/Reactotron Helper NP.app"
codesign --verbose --sign "$identity" "$app/Contents/Frameworks/Reactotron Helper.app"
codesign --verbose --sign "$identity" "$app/Contents/Frameworks/Mantle.framework/Versions/A"
codesign --verbose --sign "$identity" "$app/Contents/Frameworks/ReactiveCocoa.framework/Versions/A"
codesign --verbose --sign "$identity" "$app/Contents/Frameworks/Squirrel.framework/Versions/A"
codesign --verbose --sign "$identity" "$app"

# This will often pass, even if Gatekeeper fails.
echo ""
echo "Verifying signatures..."
codesign --verify --deep --display --verbose=4 "$app"

# This is what really counts and what the user will see.
echo ""
echo "Veriyfing Gatekeeper acceptance..."
spctl --ignore-cache --no-cache --assess --type execute --verbose=4 "$app"
