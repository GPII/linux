/*!
GPII Linux Personalization Framework Node.js Bootstrap

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

var fluid = require("universal"),
    kettle = fluid.registerNamespace("kettle");

// Settings Handlers
//
fluid.require("./gpii/node_modules/gsettingsBridge", require);
fluid.require("./gpii/node_modules/orca", require);
fluid.require("./gpii/node_modules/alsa", require);
fluid.require("./gpii/node_modules/xrandr", require);

// Device Reporters
//
fluid.require("./gpii/node_modules/packagekit", require);

kettle.config.makeConfigLoader({
    nodeEnv: kettle.config.getNodeEnv("fm.ps.sr.dr.mm.os.lms.development"),
    configPath: kettle.config.getConfigPath() || "../node_modules/universal/gpii/configs"
});
