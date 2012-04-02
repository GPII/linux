#!/bin/sh

fileName="gpii.js"

# Build and install the GPII
./build.sh

# Start the Flow Manager
node "$fileName"
