#!/bin/sh

# GPII Linux Startup Script
#
# Copyright 2012 OCAD University
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/gpii/universal/LICENSE.txt

echo "This script is deprecated and will be removed in a future release. Please look at using our new grunt tasks."

fileName="gpii.js"

# Start the Flow Manager
node "$fileName" $1

echo "This script is deprecated and will be removed in a future release. Please look at using our new grunt tasks."
