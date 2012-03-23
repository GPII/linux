#!/bin/sh

node_modules="../node_modules"
universal="../node_modules/universal"
repoURL="git://github.com/GPII/universal.git"
fileName="gpii.js"

if [ -d $node_modules ]; then
	echo "$node_modules already exists"
else
    echo "$node_modules does not exist"
    echo "creating $node_modules"
	mkdir -p "$node_modules"
fi
if [ -d $universal ]; then
	echo "$universal already exists"
else
    echo "$universal does not exist"
    echo "cloning universal"
    git clone "$repoURL" "$universal"
fi

node "$fileName"