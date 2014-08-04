/*
 *
 * GPII Acceptance Testing
 *
 * Copyright 2014 Emergya
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/gpii/universal/LICENSE.txt
 * */

/*global __dirname, require*/

"use strict";
var fluid = require("universal"),
    path = require("path"),
    kettle = fluid.registerNamespace("kettle"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.acceptanceTesting.linux");

fluid.require("../../gpii/node_modules/gsettingsBridge", require);
fluid.require("../../gpii/node_modules/orca", require);
fluid.require("../../gpii/node_modules/alsa", require);
fluid.require("../../gpii/node_modules/xrandr", require);

fluid.require("universal/tests/AcceptanceTests", require);

gpii.acceptanceTesting.linux.runTests = function (configFile, testDefs) {
    var gpiiConfig = {
        nodeEnv: configFile,
        configPath: path.resolve(__dirname, "./configs")
    };
    fluid.each(testDefs, function (testDef) {
        testDef.config = gpiiConfig;
    });
    testDefs = gpii.acceptanceTesting.buildTests(testDefs);
    module.exports = kettle.tests.bootstrap(testDefs);
};
