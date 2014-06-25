#!/bin/sh

# GPII Linux USB Drive User Listener
#
# Copyright 2012 Astea Solutions
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

# This is a workaround for correct udev script execution.
# There should be a way to avoid using a intermediate file.

gpiiBinPath="/usr/local/gpii/bin"

"$gpiiBinPath/handleUserDeviceEvent.sh" $1 $2 & exit
