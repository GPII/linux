#!/bin/bash
#
# GPII Unit Tests for Linux
#
# Copyright 2014 Lucendo Development Ltd.
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/GPII/linux/blob/master/LICENSE.txt
#
# The research leading to these results has received funding from the European Union's
# Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

declare -i error_code

trap 'error_code=$?' ERR EXIT

# TODO: Convert this to a javascript-only approach so that we can test code coverage.
pushd .
cd gpii/node_modules/gsettingsBridge/tests
# TODO: See if we can make this into a javascript-only approach
./runUnitTests.sh
# TODO: Produces no output when run on its own from the repo root. Investigate.
cd ../nodegsettings
node .//nodegsettings_tests.js
popd

if [ -n "$error_code" ]; then
  exit 1
else
  exit 0
fi
