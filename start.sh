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

fileName="gpii.js"

# Build and install the GPII
./build.sh

# Start the Flow Manager
node "$fileName"
