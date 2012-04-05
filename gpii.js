var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("gsettingsBridge", require);
fluid.require("gsettingsLaunchHandler", require);

gpii.flowManager(); 
