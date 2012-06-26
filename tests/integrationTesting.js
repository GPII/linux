/*!

Integration Testing

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require, setTimeout */

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
    },
    "carla": {
        environments: {
            "gnome": [
                {
                    "type": "gpii.gsettings.get", 
                    "data": [
                        {
                            "options": {
                                "schema": "org.gnome.desktop.a11y.magnifier"
                            },
                            "settings": {
                                "show-cross-hairs": true,
                                "lens-mode": false,
                                "mag-factor": 2,
                                "mouse-tracking": "proportional",
                                "screen-position": "right-half",
                                "scroll-at-edges": true
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
        gpii = fluid.registerNamespace("gpii"),
        jqUnit = fluid.require("jqUnit");

    fluid.require("./gpiiTests.js", require);

    gpii.integrationTesting = fluid.registerNamespace("gpii.integrationTesting");

    var integrationTester = gpii.tests.testEnvironment();

    var originalValues=null;
    
    /*
    * Save the original values - from before anything is changed. We'll expect these to
    * be set again on logout. Values will be saved in same structure as the test payloads.
    */
    var getOriginalValues = function (fulljson) {
        var origValues = fluid.copy(fulljson);
        fluid.each(origValues, function (json, token) {
            origValues[token].environments.gnome = fluid.transform(origValues[token].environments.gnome, function (testBlock, textIndex) {
                var args = {};
                args[token] = testBlock.data;
                var response = fluid.invokeGlobalFunction(testBlock.type, [args]);
                return {
                    type: testBlock.type,
                    data: response[token]
                };
            });
        });

        return origValues;
    };

    var addTests = function () {
        gpii.flowManager();

        //save original values:
        originalValues = getOriginalValues(integrationTestsJSON);    

        fluid.each(integrationTestsJSON, function (json, token) {
            integrationTester.asyncTest("Test "+token+" Login", function () {
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
                                //go through each of the settings to compare them:
                                fluid.each(changedSettings[token], function (arrayEntry, arrayInd) {
                                    //check each setting:
                                    fluid.each(arrayEntry.settings, function (settingValue, settingKey) {
                                        var expectedValue = testBlock.data[arrayInd].settings[settingKey];
                                        jqUnit.assertEquals("Check setting "+settingKey, settingValue, expectedValue);
                                        //fluid.log("Expected for "+settingKey+": "+expectedValue+" vs "+settingValue);
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
                        //fluid.log("ORIG VALS "+JSON.stringify(originalValues));
                        fluid.each(originalValues[token].environments.gnome, function (testBlock, textIndex) {
                            var args = {};
                            args[token] = testBlock.data;
                            //wait one second to ensure that the settings have propagated
                            setTimeout(function() {
                                //call the settingshandler to get the settings
                                var changedSettings = fluid.invokeGlobalFunction(testBlock.type, [args]);
                                // fluid.log(JSON.stringify(args));
                                // fluid.log("TMP: "+JSON.stringify(changedSettings));
                                //go through each of the settings to compare them:
                                fluid.each(changedSettings[token], function (arrayEntry, arrayInd) {
                                    //check each setting:
                                    fluid.each(arrayEntry.settings, function (settingValue, settingKey) {
                                        var expectedValue = testBlock.data[arrayInd].settings[settingKey];
                                        jqUnit.assertEquals("Check setting "+settingKey, settingValue, expectedValue);
                                        //fluid.log("Expected for "+settingKey+": "+expectedValue+" vs "+settingValue);
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