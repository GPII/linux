#!/bin/sh

# GPII Linux USB Drive User Listener
#
# Copyright 2012 Astea Solutions
#
# Licensed under the New BSD license. You may not use this file except in
# compliance with this License.
#
# You may obtain a copy of the License at
# https://github.com/gpii/universal/LICENSE.txt

# This is a workaround for correct udev script execution.
# There should be a way to avoid using a intermediate file.

gpiiBinPath="/usr/local/gpii/bin"

"$gpiiBinPath/handleUserDeviceEvent.sh" $1 $2 & exit
