#!/bin/sh
# This is a workaround for correct udev script execution.
# There should be a way to avoid using a intermediate file.

gpiiBinPath="/usr/local/gpii/bin"

"$gpiiBinPath/handleUserDeviceEvent.sh" $1 $2 & exit
