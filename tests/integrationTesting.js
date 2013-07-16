/*!

Integration Testing

Copyright 2013 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require */

// var integrationTestsJSON = {
//     "sammy": {
//        "initialState": [
//             {
//                 "type": "gpii.gsettings.get", 
//                 "data": [
//                     {
//                         "options": {
//                             "schema": "org.gnome.desktop.a11y.magnifier"
//                         },
//                         "settings": {
//                             "mag-factor": 2.5,
//                             "mouse-tracking": "none",
//                             "show-cross-hairs": true
//                         }
//                     },
//                     {
//                         "options": {
//                             "schema": "org.gnome.desktop.interface"
//                         },
//                         "settings": {
//                             "text-scaling-factor": 1
//                         }
//                     }
//                 ]
//             }
//         ],
//         "loggedInState": [
//             {
//                 "type": "gpii.gsettings.get", 
//                 "data": [
//                     {
//                         "options": {
//                             "schema": "org.gnome.desktop.a11y.applications"
//                         },
//                         "settings": {
//                             "screen-magnifier-enabled": true
//                         }
//                     },
//                     {
//                         "options": {
//                             "schema": "org.gnome.desktop.a11y.magnifier"
//                         },
//                         "settings": {
//                             "mag-factor": 2.0,
//                             "mouse-tracking": "centered",
//                             "show-cross-hairs": true
//                         }
//                     },
//                     {
//                         "options": {
//                             "schema": "org.gnome.desktop.interface"
//                         },
//                         "settings": {
//                             "text-scaling-factor": 2
//                         }
//                     }
//                 ]
//             }
//         ]
//     }



var tests = [
    {
        name: "Testing Mikel Vargas using Flat matchmaker (onscreen keyboard)",
        token: "MikelVargas",
        settingsHandlers: {
           "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "slowkeys-delay": { init: 100, expect: 400 },
                        "slowkeys-enable": { init: false, expect: true },
                        "bouncekeys-delay": { init: 100, expect: 200 },
                        "mousekeys-enable": { init: false, expect: true },
                        "stickykeys-enable": { init: false, expect: true },
                        "bouncekeys-enable": { init: false, expect: true },
                        "mousekeys-max-speed": { init: 250, expect: 850 },
                        "mousekeys-init-delay": { init: 110, expect: 120 },
                        "mousekeys-accel-time": { init: 300, expect: 800 },
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.keyboard"
                    }
                }]
            }
        }
    }
];

(function () {
    "strict";

    // This loads universal.
    var fluid = require("universal"),
        http = require("http"),
        gpii = fluid.registerNamespace("gpii"),
        jqUnit = fluid.require("jqUnit");

    //require("testFramework");
    require("../../node_modules/universal/gpii/node_modules/testFramework/gpiiTests.js");
    //require("settingsHandlers");
    require("gsettingsBridge");
    var integrationTesting = gpii.tests.testEnvironment();

    jqUnit.module("Integration Testing");
    
    var currentTest = tests[0];

    /*
    * Sets the settings given in the json paramater. The content of the json passed
    * is the values to set in a format similar to the content of 'initialState'
    */
    var initSettings = function (handler, payload) {
        payload = fluid.copy(payload);
        
        var initPayload = fluid.transform(payload, function (data) {
            return fluid.transform(data, function (handlerEntry) {
                var settings = handlerEntry.settings;

                var initSettingsBlock = fluid.transform(settings, function (setting) {
                    return setting.init;
                });
                return { options: handlerEntry.options, settings: initSettingsBlock };
            });  
        });

         var gottentSettings = fluid.invokeGlobalFunction(handler+".set", [initPayload]);
        console.log(JSON.stringify(gottentSettings));
    };

    integrationTesting.asyncTest("Integration Tester", function () {
        //set initial settings
        initSettings("gpii.gsettings", currentTest.settingsHandlers["gpii.gsettings"]);
    
        //start up server
        gpii.config.makeConfigLoader({
            "nodeEnv": "development-config",
            "configPath": __dirname+"/integrationTests/setup1/configs"
        });
        fluid.log("SERVER STARTED");

        //log user in:
        http.get({
            host: "localhost",
            port: 8081,
            path: "/user/"+currentTest.token+"/login"
        }, function(response) {
            var data = "";
            fluid.log("Callback from use login called");

            response.on("data", function (chunk) {
                fluid.log("Response from server: " + chunk);
                data += chunk;
            });
            response.on("close", function(err) {
                if (err) {
                    jqUnit.assertFalse("Got an error on login: " + err.message, true);
                    jqUnit.start();
                }
                fluid.log("Connection to the server was closed");
            });
            response.on("end", function() {
                fluid.log("Connection to server ended");
                jqUnit.assertNotEquals("Successful login message returned "+data, data.indexOf("User with token "+currentTest.token+" was successfully logged in."), -1);
                http.get({
                    host: "localhost",
                    port: 8081,
                    path: "/user/"+currentTest.token+"/logout"
                });
                jqUnit.start();
            });
        }).on('error', function(err) {
            fluid.log("Got error: " + err.message);
            jqUnit.start();
        });
    });
    // integrationTesting.test("Integration Tester", function () {
    //     fluid.log("Integration Testing started");
    //     //start up server
    //     gpii.flowManager();

    //     //set initial settings:

    //     gpii.config.makeConfigLoader({
    //         nodeEnv: gpii.config.getNodeEnv("fm.ps.sr.dr.mm.os.development"),
    //         configPath: gpii.config.getConfigPath() || "../node_modules/universal/gpii/configs"
    //     });
    // });

//     /*
//     * Sets the settings given in the json paramater. The content of the json passed
//     * is the values to set in a format similar to the content of 'initialState'
//     */
//     var setSettings = function (json) {
//         //go through each of the settings
//         fluid.each(json, function (handlerBlock, handlerIndex) {
//             var args = {};
//             args.setting = handlerBlock.data;
//             var setter = handlerBlock.type.substr(0, handlerBlock.type.indexOf(".get"))+".set";
//             fluid.invokeGlobalFunction(setter, [args]);
//         });
//     };

//     /*
//     * Checks the settings given in the json paramater. The content of the json passed
//     * should contain the expected value, and they should be in the format of the contant
//     * of 'initialState'
//     */
//     var checkSettings = function (expected, description) {
//         //go through each of the settings
//         fluid.each(expected, function (handlerBlock, handlerIndex) {
//             //first get the settings from the system
//             var args = {};
//             args.checking = handlerBlock.data;
//             var response = fluid.invokeGlobalFunction(handlerBlock.type, [args]);
//             //check that these corresponds to the one we anted to set:s
//             jqUnit.assertDeepEq("Settings should match: " + description, handlerBlock.data, response.checking);
//         });
//     };

//     var addRESTTest = function(token, action, onEnd) {
//         //test login with token
//         integrationTester.asyncTest("Test "+token+" "+action, function () {
//             http.get({
//                 host: "localhost",
//                 port: 8081,
//                 path: "/user/"+token+"/"+action
//             }, function(response) {
//                 var data = "";
//                 fluid.log("Callback from use "+action+" called");

//                 response.on("data", function (chunk) {
//                     fluid.log("Response from server: " + chunk);
//                     data += chunk;
//                 });
//                 response.on("close", function(err) {
//                     if (err) {
//                         jqUnit.assertFalse("Got an error on "+action+": " + err.message, true);
//                         jqUnit.start();
//                     }
//                     fluid.log("Connection to the server was closed");
//                 });
//                 response.on("end", function() {
//                     fluid.log("Connection to server ended");
//                     onEnd(data);
//                 });
//             }).on('error', function(err) {
//                 fluid.log("Got error: " + err.message);
//                 jqUnit.start();
//             });
//         });
//     };

//     gpii.flowManager();
//     var tokenQueue = Object.keys(integrationTestsJSON);
    
//     var testNextToken = function() {
//         if (tokenQueue.length === 0) {
//             return;
//         }

//         var token = tokenQueue.pop();
//         var json = integrationTestsJSON[token];

//         //Setup and check an initial known state:
//         //Made asynchronous due to qunit bug that doesn't allow synchronous tests
//         integrationTester.asyncTest("Set up initial state", function() {
//             setSettings(json.initialState);
//             setTimeout(function() {
//                 checkSettings(json.initialState, token + " profile initial state");
//                 jqUnit.start();
//             }, 1);
//         });

//         //test login:
//         addRESTTest(token, "login", function (data) {
//             jqUnit.assertNotEquals("Successful login message returned", data.indexOf("User was successfully logged in."), -1);
//             setTimeout(function() {
//                 checkSettings(json.loggedInState, token + " logged in.");
//                 //test logout:
//                 addRESTTest(token, "logout", function (data) {
//                     jqUnit.assertNotEquals("Successful logout message returned", data.indexOf("successfully logged out."), -1);
//                     setTimeout(function() {
//                         checkSettings(json.initialState, token + " back to initial state");
//                         //let the system know we're ready for another test: 
//                         testNextToken();
//                         jqUnit.start();
//                     }, 1000);
//                 });
//                 jqUnit.start();
//             }, 1000);
//         });
//     };

//     testNextToken();
// }());
    // Integration test pseudo code:
    // test A: {
    //         name: "Screenreader user on windows",
    //         config: "path.to.config.file",
    //         token: "<token>",
    //             settingsHandlers: [{
    //                     type: "without get/set part",
    //                     options: { options to pass the handler },
    //                     settings: {
    //                             Setting1: { 
    //                                     init: { "initial value" },
    //                                     expect: { "assert value after login" }
    //                                 },
    //                             ...,
    //                             SettingN: ...
    //                     },
    //             }],
    //             Processes: [{
    //                     checkRunning: {
    //                             command: "...",
    //                             grep: "..."
    //                     }
    //             }]
    //     }
    // }
    // For each test TestX:
    //     For each settings handler SH in TestX
    //             For each setting listed in expected section of SH
    //             get the current value -> save
    //     On (All settings gathered)
    //         Start GPII
    //     On (GPII started)
    //         HTTP GET: localhost:8081/user/<token>/login
    //     On (on user logged in)
    //         For each settings handler SH in TestX
    //             For each setting listed in expected section of SH
    //                 check that the setting = expected
    //         For each expected process
    //             Check running processes, compare to expected
    //         HTTP GET: localhost:8081/user/<token>/logout
    //     On (User logged out)
    //         For each settings handler SH in TestX
    //             For each setting listed in expected section of SH
    //                 check that the setting = original setting
    //         For each expected process
    //             check it's not running
    //         Shut down GPII
    //     On (GPII shut down)
    //         send signal that next test can be launched
})();