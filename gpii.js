/*!
GPII Linux Personalization Framework Node.js Bootstrap

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("gsettingsBridge", require);
fluid.require("orca", require);

gpii.config.makeConfigLoader({
    nodeEnv: gpii.config.getNodeEnv("fm.ps.sr.dr.mm.os.development"),
    configPath: gpii.config.getConfigPath() || "../node_modules/universal/gpii/configs"
});
