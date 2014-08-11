/*
GPII Node.js ALSA Volume Bridge

Copyright 2013 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";

var fluid = require("universal"),
    jqUnit = fluid.require("jqUnit"),
    alsa = require("./build/Release/nodealsa.node");

jqUnit.module("GPII ALSA Volume Bridge");

jqUnit.test("Running tests for ALSA bindings", function () {
    jqUnit.expect(4);

    // Check if all required methods are available
    //
    var methods = ["getSystemVolume", "setSystemVolume"];

    for (var method in methods) {
        jqUnit.assertTrue("Checking availability of method '" + method + "'",
                          (methods[method] in alsa));
    }

    var volume = alsa.getSystemVolume();

    jqUnit.assertTrue("Checking 'setSystemVolume' method",
                      alsa.setSystemVolume(0));

    jqUnit.assertDeepEq("'getSystemVolume' returns a expected value" +
                        " and 'setSystemVolume' worked as expected",
                        alsa.getSystemVolume(), 0);

    // Restore the volume to its previous value
    //
    alsa.setSystemVolume(volume);

});
