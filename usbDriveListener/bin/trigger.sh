#!/bin/sh
# This is a workaround for correct udev script execution.
# There should be a way to avoid using a intermediate file.
cd /home/boyan/repos/gpiistack/usb_auth
./usb_test.sh $1 $2 & exit
