#!/bin/sh

# GPII Linux Clean Script
#
# Copyright 2012 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/gpii/universal/LICENSE.txt

cd node_modules/gsettingsBridge/nodegsettings
node-gyp clean
rm -rf build
cd ../../..

cd node_modules/xrandr/nodexrandr
node-gyp clean
rm -rf build
cd ../../..

sudo rm -rf /usr/local/gpii
sudo rm -rf /var/lib/gpii
sudo rm -f /etc/udev/rules.d/80-gpii.rules

# TODO: It seems extremely dangerous to go around deleting the node_modules directory we installed,
# in case the developer has unpushed modifications in there.
# rm -rf ../node_modules
