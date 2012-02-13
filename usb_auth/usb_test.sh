#!/bin/sh
if [ $1 -eq 1 ]; then
	# USB disk drive is added.
	retries=0
	# Wait for drive to be mounted. There should be a better solution using nautilus.
	until [[ `mount | grep $2` || $retries -ge 5 ]]; do
		retries=$[$retries+1]
		sleep 1
	done
	loc=`mount | grep /sdb1 |cut -d " " -f 3` # The location where the USB disk drive is mounted.
	token=`cat $loc/token.txt` # The token that identifies the user.
	curl http://localhost:8000/users?action=login\&device=$2\&token=$token # A call to the Node.js server
else
	# USB disk drive is removed.
	curl http://localhost:8000/users?action=logout\&device=$2
fi
