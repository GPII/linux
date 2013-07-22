/*!

Integration Testing

Copyright 2013 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require, console */

// var tests = [
//     {
//         name: "Testing Mikel Vargas using Flat matchmaker (onscreen keyboard)",
//         token: "MikelVargas",
//         settingsHandlers: {
//            "gpii.gsettings": {
//                 "data": [{
//                     "settings": {
//                         "slowkeys-delay": { init: 100, expect: 400 },
//                         "slowkeys-enable": { init: false, expect: true },
//                         "bouncekeys-delay": { init: 100, expect: 200 },
//                         "mousekeys-enable": { init: false, expect: true },
//                         "stickykeys-enable": { init: false, expect: true },
//                         "bouncekeys-enable": { init: false, expect: true },
//                         "mousekeys-max-speed": { init: 250, expect: 850 },
//                         "mousekeys-init-delay": { init: 110, expect: 120 },
//                         "mousekeys-accel-time": { init: 300, expect: 800 },
//                     },
//                     "options": {
//                         "schema": "org.gnome.desktop.a11y.keyboard"
//                     }
//                 }]
//             }
//         },
//         processes: [
//             {
//                 command: "gsettings get org.gnome.desktop.a11y.applications screen-keyboard-enabled",
//                 expect: "true"
//             }
//         ]
//     }
// ];

(function () {
    "use strict";

    // This loads universal.
    var fluid = require("universal"),
        //http = require("http"),
        gpii = fluid.registerNamespace("gpii"),
        jqUnit = fluid.require("jqUnit");

    //require("testFramework");
    require("../../node_modules/universal/gpii/node_modules/testFramework/gpiiTests.js");
    require("gsettingsBridge");

    fluid.defaults("gpii.integrationTesting.testEnv", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            // gpiiServer: {
            //     type: "gpii.server"
            // },
            integrationTests: {
                type: "gpii.integrationTesting.integrationTests"
            }
        }
    });

    fluid.defaults("gpii.integrationTesting.integrationTests", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        components: [ {
            name: "Full configuration process",
            tests: [{
                name: "Config process",
                expect: 1,
                sequence: [ {
                    func: "gpii.integrationTesting.initSettings",
                    args: [ ""]
                }
                ]
            }
            ]
        }]
    });

    gpii.integrationTesting.initSettings = function () {
        //sconsole.log(a);
        console.log(b);

    };

    fluid.test.runTests([
        "gpii.integrationTesting.testEnv"
    ]);

    // var integrationTesting = gpii.tests.testEnvironment();

    // jqUnit.module("Integration Testing");
    
    // var currentTest = tests[0];

    // var extractPayloads = function (test) {
    //     var settingsHandlers = test.settingsHandlers;
    //     var payloads = {
    //         init: fluid.copy(settingsHandlers),
    //         get: fluid.copy(settingsHandlers),
    //         expect: fluid.copy(settingsHandlers)
    //     };

    //     fluid.each(settingsHandlers, function (handlerBlock, handlerID) {
    //         fluid.each(handlerBlock, function (hbArray, hbHeader) {
    //             fluid.each(hbArray, function (handlerEntry, index) {
    //                 var settings = handlerEntry.settings;
    //                 var initBlock = {};
    //                 var getBlock = {};
    //                 var expectBlock = {};

    //                 fluid.each(settings, function (val, key) {
    //                     initBlock[key] = val.init;
    //                     getBlock[key] = null;
    //                     expectBlock[key] = val.expect;
    //                 });
                    
    //                 payloads.init[handlerID][hbHeader][index] = { options: handlerEntry.options, settings: initBlock };
    //                 payloads.get[handlerID][hbHeader][index] = { options: handlerEntry.options, settings: getBlock };
    //                 payloads.expect[handlerID][hbHeader][index] = { options: handlerEntry.options, settings: expectBlock };
    //             });  
    //         });
    //     });
    //     return payloads;
    // };

    // /*
    // * Sets the settings given in the json paramater. The content of the json passed
    // * is the values to set in a format similar to the content of 'initialState'
    // */
    // var callHandlers = function (payload, action) {
    //     var ret = {};
    //     fluid.each(payload, function (handlerBlock, handlerID) {
    //         ret[handlerID]=fluid.invokeGlobalFunction(handlerID+"."+action, [handlerBlock]);
    //     });
    //     return ret;
    // };

    // var checkProcesses = function (payload, expectProcess) {
    //     fluid.each(payload, function (processBlock, index) {
            
    //     });
    // };

    // var addRESTTest = function(token, action, onEnd) {
    //     http.get({
    //         host: "localhost",
    //         port: 8081,
    //         path: "/user/"+token+"/"+action
    //     }, function(response) {
    //         var data = "";
    //         fluid.log("Callback from "+action+" called");

    //         response.on("data", function (chunk) {
    //             fluid.log("Response from server: " + chunk);
    //             data += chunk;
    //         });
    //         response.on("close", function(err) {
    //             if (err) {
    //                 jqUnit.assertFalse("Got an error on "+action+": " + err.message, true);
    //                 jqUnit.start();
    //             }
    //             fluid.log("Connection to the server was closed");
    //         });
    //         response.on("end", function() {
    //             fluid.log("Connection to server ended");
    //             onEnd(data);
    //         });
    //     }).on('error', function(err) {
    //         fluid.log("Got error: " + err.message);
    //         jqUnit.start();
    //     });
    // };
    
    // integrationTesting.asyncTest("Integration Tester", function () {
    //     //extract the payloads we need from test:
    //     var payloads = extractPayloads(currentTest);

    //     //set initial settings
    //     callHandlers(payloads.init, "set");
    //     //and check that they are properly set
    //     var returned = callHandlers(payloads.get, "get");
    //     jqUnit.assertDeepEq("Checking that initial settings are properly set", returned, payloads.init);

    //     //start up server
    //     var currentGpii = gpii.config.makeConfigLoader({
    //         "nodeEnv": "development-config",
    //         "configPath": __dirname+"/integrationTests/setup1/configs"
    //     });
    //     fluid.log("SERVER STARTED");

    //     currentGpii.server.flowManager.lifecycleManager.events.configurationApplied.addListener(function () {
    //         var returned = callHandlers(payloads.get, "get");
    //         jqUnit.assertDeepEq("Checking that settings are properly set", returned, payloads.expect);
    //         //log out
    //         addRESTTest(currentTest.token, "logout", function(data) {   
    //             jqUnit.assertNotEquals("Successful logout message returned", data.indexOf("successfully logged out."), -1);
    //             console.log("So far, so good");
    //             jqUnit.start();               
    //         });
    //     });

    //     currentGpii.server.flowManager.lifecycleManager.events.configurationRemoved.addListener(function () {
    //         var returned = callHandlers(payloads.get, "get");
    //         jqUnit.assertDeepEq("Checking that settings are properly restored", returned, payloads.init);
    //     });

    //     addRESTTest(currentTest.token, "login", function (data) {
    //         jqUnit.assertNotEquals("Successful login message returned "+data, data.indexOf("User with token "+token+" was successfully logged in."), -1);                
    //     });

    // });

})();