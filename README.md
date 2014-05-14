# GNU/Linux

This repository contains all of the platform-specific code required to run the GPII Personalization Framework on GNU/Linux with GNOME.

The following components can be found in the repository:

* usbDriveListener: a UserListener implementation that will detect a USB drive 
  with an anonymous GPII user token installed on it
* gSettingsBridge: a Node.js module for accessing the gSettings API via 
  JavaScript within a Node application
* orca: a Node.js module for dealing with GNOME Orca's settings
* alsa: a Node.js module for accessing the ALSA API via JavaScript within a 
  Node application to interact with system's volume
* xrandr: a Node.js module for accessing the XRandr API via JavaScript within 
  a Node application. This module is used for setting the resolution and the 
  screen brightness.

# Building, Installing, and Running

We use the grunt task system to perform our build operations.  If you don't 
have grunt installed yet you can do so with:

    npm install -g grunt-cli

To fetch our core universal dependencies and build the linux specific plugins
run

    grunt build
    
Because the history of the universal repository is quite large, it can take a
long time to clone (and sometimes will fail depending on the network). To 
check it out faster for testing use the fastClone option. Note however, you 
will need the regular build in order to commit code and push on universal.

    grunt build --fastClone    

To clean the plugin binaries use

    grunt clean

You can start the GPII local server on port 8080 using:

    grunt start

To install and uninstall the listener components use the following. Note that
this may prompt you for sudo access.

    grunt install
    grunt uninstall
