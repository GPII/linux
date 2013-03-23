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

usersFilePath="/var/lib/gpii/users.txt"
logFilePath="/var/lib/gpii/log.txt"

if [ $1 -eq 1 ]; then
	# USB disk drive is added.
	retries=0
	# Wait for drive to be mounted. There should be a better solution using nautilus.
	until [[ `mount | grep $2` || $retries -ge 5 ]]; do
		retries=$[$retries+1]
		sleep 1
	done

    mountLocation=`mount | grep $2 | sed -e "s#/[^ ]\+ [^ ]\+ \(.*\) type.*#\1#" | head -n 1`
    token=`cat "$mountLocation/.gpii-user-token.txt"`
	echo "User logged in on device $2 with token ${token}." >> "$logFilePath"
	echo $2:$token >> "$usersFilePath"						# Keep the location and token in a users file.
	curl http://localhost:8081/user/$token/login
else
	# USB disk drive is removed.
	token=`grep $2 < "$usersFilePath" | cut -d ":" -f 2`
	curl http://localhost:8081/user/$token/logout
	sed -ie "\|^$2|d" "$usersFilePath" 						# Remove entry from the users file
	echo "User logged out from device $2 with token ${token}." >> "$logFilePath"
fi
