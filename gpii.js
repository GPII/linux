/*
 * GPII Linux Personalization Framework Node.js Bootstrap
 *
 * Copyright 2012 OCAD University
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

var fluid = require("universal"),
    kettle = fluid.registerNamespace("kettle");

fluid.require("gsettingsBridge", require);
fluid.require("orca", require);
fluid.require("alsa", require);
fluid.require("xrandr", require);

kettle.config.makeConfigLoader({
    nodeEnv: kettle.config.getNodeEnv("fm.ps.sr.dr.mm.os.lms.development"),
    configPath: kettle.config.getConfigPath() || "../node_modules/universal/gpii/configs"
});
