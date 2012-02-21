#!/bin/sh
if [ $1 -eq 1 ]; then
	# USB disk drive is added.
	retries=0
	# Wait for drive to be mounted. There should be a better solution using nautilus.
	until [[ `mount | grep $2` || $retries -ge 5 ]]; do
		retries=$[$retries+1]
		sleep 1
	done
	loc=`mount | grep $2 |cut -d " " -f 3` # The location where the USB disk drive is mounted.
	token=`cat $loc/token.txt` # The token that identifies the user.
	echo "User logged in on device $2 with token ${token}." >> log.txt
	curl http://localhost:3000/user/$token # A call to the preferences server
	# curl http://localhost:3000/user/$token/login # A call to the Flow Manager
else
	# USB disk drive is removed.
	echo "User logged out from device $2." >> log.txt
	# curl http://localhost:3000/user/$token/logout # A call to the Flow Manager
fi
