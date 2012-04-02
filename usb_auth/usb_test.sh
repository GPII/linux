#!/bin/sh
if [ $1 -eq 1 ]; then
	# USB disk drive is added.
	retries=0
	# Wait for drive to be mounted. There should be a better solution using nautilus.
	until [[ `mount | grep $2` || $retries -ge 5 ]]; do
		retries=$[$retries+1]
		sleep 1
	done

	mountLocation=`mount | grep $2 |cut -d " " -f 3`
	token=`cat $mountLocation/token.txt`
	echo "User logged in on device $2 with token ${token}." >> log.txt
	echo $2:$token >> users.txt						# Keep the location and token in a users file.
	curl http://localhost:3000/user/$token
else
	# USB disk drive is removed.
	token=`grep $2 < users.txt | cut -d ":" -f 2`
	sed -ie "\|^$2|d" users.txt 						# Remove entry from the users file
	echo "User logged out from device $2 with token ${token}." >> log.txt
fi
