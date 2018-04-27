/*
 * GPII Linux Personalization Framework Node.js Index
 *
 * Copyright 2012 OCAD University
 * Copyright 2014 Lucendo Development Ltd.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/linux/blob/master/LICENSE.txt
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 */

"use strict";

var fluid = require("gpii-universal");

fluid.module.register("gpii-linux", __dirname, require);

fluid.contextAware.makeChecks({
    "gpii.contexts.linux": {
        value: true
    }
});

// Settings Handlers

require("./gpii/node_modules/gsettingsBridge");
require("./gpii/node_modules/orca");
require("./gpii/node_modules/alsa");
require("./gpii/node_modules/xrandr");

// Device Reporters

require("./gpii/node_modules/packagekit");
require("./gpii/node_modules/platformReporter");
