#!/bin/bash
LOC="/usr/share/glib-2.0/schemas"

# Copy schemas to global location and compile them
sudo cp data/net.gpii.testing.gsettings.gschema.xml $LOC
sudo glib-compile-schemas $LOC

# Make sure they are reset in case they already existed
gsettings reset-recursively net.gpii.testing.gsettings.single-get
gsettings reset-recursively net.gpii.testing.gsettings.single-set
gsettings reset-recursively net.gpii.testing.gsettings.multi-get1
gsettings reset-recursively net.gpii.testing.gsettings.multi-get2
gsettings reset-recursively net.gpii.testing.gsettings.multi-set1
gsettings reset-recursively net.gpii.testing.gsettings.multi-set2
gsettings reset-recursively net.gpii.testing.gsettings.multi-set3

#Run the tests:
node gsettingsTests.js

#Delete the schemas when done and recompile:
sudo rm "$LOC/net.gpii.testing.gsettings.gschema.xml"
sudo glib-compile-schemas $LOC



