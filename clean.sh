#!/bin/sh

# GPII Linux Clean Script
#
# Copyright 2012 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# The research leading to these results has received funding from the European Union's
# Seventh Framework Programme (FP7/2007-2013)
# under grant agreement no. 289016.
#
# You may obtain a copy of the License at
# https://github.com/GPII/universal/blob/master/LICENSE.txt


echo "This script is deprecated and will be removed in a future release. Please look at using our new grunt tasks."

cd node_modules/gsettingsBridge/nodegsettings
node-gyp clean
rm -rf build
cd ../../..

cd node_modules/alsa/nodealsa
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

echo "This script is deprecated and will be removed in a future release. Please look at using our new grunt tasks."
