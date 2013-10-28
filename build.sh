#!/bin/sh

# GPII Linux Build Script
#
# Copyright 2012 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/gpii/universal/LICENSE.txt

currentDir=`pwd`
node_modules="../node_modules"
universal="../node_modules/universal"
repoURL="git://github.com/GPII/universal.git"
usbListenerDir="./usbDriveListener"
gpiiInstallDir="/usr/local/gpii"
gpiiStateDir="/var/lib/gpii"

# Clone the necessary GPII framework dependencies from Git.
# TODO: Deal with cut and pastage for directory creation logic.
if [ -d $node_modules ]; then
    echo "$node_modules already exists"
else
    echo "$node_modules does not exist"
    echo "creating $node_modules"
    mkdir -p "$node_modules"
fi
if [ -d $universal ]; then
    echo "$universal already exists"
else
    echo "$universal does not exist"
    echo "cloning universal"
    git clone "$repoURL" "$universal"
    cd $universal
    npm install
    cd $currentDir
fi

# Compile the GSettings C++ Bridge
cd node_modules/gsettingsBridge/nodegsettings
node-gyp configure build
cd ../../..

# Compile the GSettings C++ Bridge
cd node_modules/alsa/nodealsa
node-gyp configure build
cd ../../..

# Create standard directory structure for GPII.
# Note: everything below here must be run as root, since we're installing ourselves centrally.
if [ -d $gpiiInstallDir ]; then
    echo "$gpiiInstallDir already exists"
else
    echo "$gpiiInstallDir does not exist"
    echo "creating $gpiiInstallDir"
    sudo mkdir -p "$gpiiInstallDir"
fi

if [ -d $gpiiStateDir ]; then
    echo "$gpiiStateDir already exists"
else
    echo "$gpiiStateDir does not exist"
    echo "creating $gpiiStateDir"
    sudo mkdir -p "$gpiiStateDir"
fi

# Install the USB Drive User Listener
# TODO: We should install the entire GPII in /usr/local/gpii, not just the USB Listener
sudo cp -r "$usbListenerDir/bin" "$gpiiInstallDir/bin"
sudo cp "$usbListenerDir/80-gpii.rules" /etc/udev/rules.d/
