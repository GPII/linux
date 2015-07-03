 /*
 * GPII Linux Personalization Framework Node.js Index
 *
 * Copyright 2012 OCAD University
 * Copyright 2014 Lucendo Development Ltd.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */
 
var fluid = require("universal");

fluid.module.register("gpii-linux", __dirname, require);

// Settings Handlers
//
fluid.require("./gpii/node_modules/gsettingsBridge", require);
fluid.require("./gpii/node_modules/orca", require);
fluid.require("./gpii/node_modules/alsa", require);
fluid.require("./gpii/node_modules/xrandr", require);

// Device Reporters
//
fluid.require("./gpii/node_modules/packagekit", require);
