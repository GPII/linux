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

gpii.flowManager();
 
