/*!

Integration Testing

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require*/
// var sammyTest = {
//     token: "sammy", 
//     environments: {
//         "gnome": [
//             {
//                 "type": "gpii.gsettings.set", 
//                 data: [
//                     "options": {
//                         "schema": "org.gnome.desktop.a11y.magnifier",
//                     },
//                     "settings": {
//                         "mag-factor": 2.0
//                     }
//                 ]
//             }
//         ]
//     }
// };
var integrationTestsJSON = {
    "sammy": {
        environments: {
            "gnome": [
                {
                    "type": "gpii.gsettings.get", 
                    "data": [
                        {
                            "options": {
                                "schema": "org.gnome.desktop.a11y.applications"
                            },
                            "settings": {
                                "screen-magnifier-enabled": true
                            }
                        },
                        {
                            "options": {
                                "schema": "org.gnome.desktop.a11y.magnifier"
                            },
                            "settings": {
                                "mag-factor": 2.0
                            }
                        }
                    ]
                }
            ]
        }
    }
};

(function () {
    // This loads universal.
    var fluid = require("universal"),
        http = require("http"),
        fs = require("fs"),
        os = require("os"),
        gpii = fluid.registerNamespace("gpii"),
        jqUnit = fluid.require("jqUnit");

    fluid.require("./gpiiTests.js", require);

    gpii.integrationTesting = fluid.registerNamespace("gpii.integrationTesting");
    gpii.integrationTesting.mockLaunchHandler = function(data) {
        jqUnit.assert("gpii.integrationTesting.mockLaunchHandler called");
        return data;
    };

    var integrationTester = gpii.tests.testEnvironment();

    var originalValues=null;
    
    /*
    * Save the original values - from before anything is changed. We'll expect these to
    * be set again on logout. Values will be saved in same structure as the test payloads.
    */
    var getOriginalValues = function (json, token) {
        var origValues = fluid.copy(json);
        origValues.environments.gnome = fluid.transform(origValues.environments.gnome, function (testBlock, textIndex) {
            var args = {};
            args[token] = testBlock.data;
            var response = fluid.invokeGlobalFunction(testBlock.type, [args]);
            //console.log("KKKKKKAAAAAAAAAAASSSSSSSSSPPPPPPPPPPPPAAAAAAAAAARRRRRRRRRRRR: "+JSON.stringify(response));
            return {
                type: testBlock.type,
                data: response[token]
            };
        });
        return origValues;
    };

    var addTests = function () {
        fluid.each(integrationTestsJSON, function (json, token) {
            integrationTester.asyncTest("Test "+token+" Login", function () {
                //save original values:
                originalValues = {};
                originalValues[token] = getOriginalValues(json, token);        
                //console.log("ORIGINALS: "+JSON.stringify(originalValues));

                var flowManager = gpii.flowManager();
                http.get({
                    host: "localhost",
                    port: 8081,
                    path: "/user/"+token+"/login"
                }, function(response) {
                    var data = "";
                    fluid.log("Callback from use login called");

                    response.on("data", function (chunk) {
                        fluid.log("Response from server: " + chunk);
                        data += chunk;
                    });
                    response.on("close", function(err) {
                        if (err) {
                            jqUnit.assertFalse("Got an error on login:" + err.message, true);
                            jqUnit.start();
                        }
                        fluid.log("Connection to the server was closed");
                    });
                    response.on("end", function() {
                        fluid.log("Connection to server ended");
                        jqUnit.assertNotEquals("Successful login message returned", data.indexOf("User was successfully logged in."), -1);
                        //After successful login, get settings and check that they're as expected.
                        fluid.each(json.environments.gnome, function (testBlock, textIndex) {
                            var args = {};
                            args[token] = testBlock.data;
                            //wait one second to ensure that the settings have propagated
                            setTimeout(function() {
                                //call the settingshandler to get the settings
                                var changedSettings = fluid.invokeGlobalFunction(testBlock.type, [args]);
                                // console.log(JSON.stringify(args));
                                // console.log("TMP: "+JSON.stringify(changedSettings));
                                //go through each of the settings to compare them:
                                fluid.each(changedSettings[token], function (arrayEntry, arrayInd) {
                                    //check each setting:
                                    fluid.each(arrayEntry.settings, function (settingValue, settingKey) {
                                        var expectedValue = testBlock.data[arrayInd].settings[settingKey];
                                        jqUnit.assertEquals("Check setting "+settingKey, settingValue, expectedValue);
                                        //console.log("Expected for "+settingKey+": "+expectedValue+" vs "+settingValue);
                                    });
                                });
                                jqUnit.start(); 
                            }, 1000);
                        });
                    });
                }).on('error', function(err) {
                    fluid.log("Got error: " + err.message);
                    jqUnit.start();
                });
            });

            integrationTester.asyncTest("Test "+token+" logout", function () {
                http.get({
                    host: "localhost",
                    port: 8081,
                    path: "/user/"+token+"/logout"
                }, function(response) {
                    var data = "";
                    response.on("data", function (chunk) {
                        fluid.log("Response from server: " + chunk);
                        data += chunk;
                    });
                    response.on("close", function(err) {
                        if (err) {
                            jqUnit.assertFalse("Got an error on login:" + err.message, true);
                            jqUnit.start();
                        }
                        fluid.log("Connection to the server was closed");
                    });
                    response.on("end", function() {
                        fluid.log("Logout connection to server ended");
                        jqUnit.assertNotEquals("Successful logout message returned", data.indexOf("successfully logged out."), -1);
                        //After successful logout, get settings and check that they have been properly reset
                        console.log("ORIG VALS "+JSON.stringify(originalValues));
                        fluid.each(originalValues[token].environments.gnome, function (testBlock, textIndex) {
                            var args = {};
                            args[token] = testBlock.data;
                            //wait one second to ensure that the settings have propagated
                            setTimeout(function() {
                                //call the settingshandler to get the settings
                                var changedSettings = fluid.invokeGlobalFunction(testBlock.type, [args]);
                                // console.log(JSON.stringify(args));
                                // console.log("TMP: "+JSON.stringify(changedSettings));
                                //go through each of the settings to compare them:
                                fluid.each(changedSettings[token], function (arrayEntry, arrayInd) {
                                    //check each setting:
                                    fluid.each(arrayEntry.settings, function (settingValue, settingKey) {
                                        var expectedValue = testBlock.data[arrayInd].settings[settingKey];
                                        jqUnit.assertEquals("Check setting "+settingKey, settingValue, expectedValue);
                                        //console.log("Expected for "+settingKey+": "+expectedValue+" vs "+settingValue);
                                    });
                                });
                                jqUnit.start(); 
                            }, 1000);
                        });
                    });
                }).on('error', function(err) {
                    fluid.log("Got error: " + err.message);
                    jqUnit.start();
                });
            });
        });
    };
    addTests();
}());