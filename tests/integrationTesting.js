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
       "initialState": [
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
                            "mag-factor": 2.5,
                            "mouse-tracking": "none",
                            "show-cross-hairs": true
                        }
                    },
                    {
                        "options": {
                            "schema": "org.gnome.desktop.interface"
                        },
                        "settings": {
                            "text-scaling-factor": 1
                        }
                    }
                ]
            }
        ],
        "loggedInState": [
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
                            "mag-factor": 2.0,
                            "mouse-tracking": "centered",
                            "show-cross-hairs": true
                        }
                    },
                    {
                        "options": {
                            "schema": "org.gnome.desktop.interface"
                        },
                        "settings": {
                            "text-scaling-factor": 2
                        }
                    }
                ]
            }
        ]
    },   
    "carla": {
        "initialState": [
            {
                "type": "gpii.gsettings.get", 
                "data": [
                    {
                        "options": {
                            "schema": "org.gnome.desktop.a11y.applications"
                        },
                        "settings": {
                            "screen-magnifier-enabled": false
                        }
                    }, {
                        "options": {
                            "schema": "org.gnome.desktop.a11y.magnifier"
                        },
                        "settings": {
                            "show-cross-hairs": false,
                            "lens-mode": false,
                            "mag-factor": 4,
                            "mouse-tracking": "centered",
                            "screen-position": "left-half",
                            "scroll-at-edges": false
                        }
                    },
                    {
                        "options": {
                            "schema": "org.gnome.desktop.interface"
                        },
                        "settings": {
                            "text-scaling-factor": 1
                        }
                    }
                ]
            }
        ],
        "loggedInState": [
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
                    }, {
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
                    },
                    {
                        "options": {
                            "schema": "org.gnome.desktop.interface"
                        },
                        "settings": {
                            "text-scaling-factor": 2
                        }
                    }
                ]
            }
        ]
    },
    "MikelVargas": {
        "initialState": [
            {
                "type": "gpii.gsettings.get",
                "data": [
                    {
                        "options": {
                            "schema": "org.gnome.desktop.a11y.applications"
                        },
                        "settings": {
                            "screen-keyboard-enabled": false
                        }
                    },
                    {
                        "options": {
                            "schema": "org.gnome.desktop.a11y.keyboard"
                        },
                        "settings": {
                            "stickykeys-enable": false,
                            "slowkeys-enable": false,
                            "slowkeys-delay": 100,
                            "bouncekeys-enable": false,
                            "bouncekeys-delay": 100,
                            "mousekeys-enable": false,
                            "mousekeys-init-delay": 100,
                            "mousekeys-max-speed": 100,
                            "mousekeys-accel-time": 100
                        }
                    }
                ]
            }
        ],
        "loggedInState": [
            {
                "type": "gpii.gsettings.get", 
                "data": [
                    {
                        "options": {
                            "schema": "org.gnome.desktop.a11y.applications"
                        },
                        "settings": {
                            "screen-keyboard-enabled": true
                        }
                    },
                    {
                        "options": {
                            "schema": "org.gnome.desktop.a11y.keyboard"
                        },
                        "settings": {
                            "stickykeys-enable": true,
                            "slowkeys-enable": true,
                            "slowkeys-delay": 400,
                            "bouncekeys-enable": true,
                            "bouncekeys-delay": 200,
                            "mousekeys-enable": true,
                            "mousekeys-init-delay": 120,
                            "mousekeys-max-speed": 850,
                            "mousekeys-accel-time": 800
                        }
                    }
                ]
            }
        ]
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

    /*
    * Sets the settings given in the json paramater. The content of the json passed
    * is the values to set in a format similar to the content of 'initialState'
    */
    var setSettings = function (json) {
        //go through each of the settings
        fluid.each(json, function (handlerBlock, handlerIndex) {
            var args = {};
            args.setting = handlerBlock.data;
            var setter = handlerBlock.type.substr(0, handlerBlock.type.indexOf(".get"))+".set";
            fluid.invokeGlobalFunction(setter, [args]);
        });
    };

    /*
    * Checks the settings given in the json paramater. The content of the json passed
    * should contain the expected value, and they should be in the format of the contant
    * of 'initialState'
    */
    var checkSettings = function (expected) {
        //go through each of the settings
        fluid.each(expected, function (handlerBlock, handlerIndex) {
            //first get the settings from the system
            var args = {};
            args.checking = handlerBlock.data;
            var response = fluid.invokeGlobalFunction(handlerBlock.type, [args]);
            //check that these corresponds to the one we anted to set:
            fluid.each(handlerBlock.data, function (solutionBlock, solutionIndex) {
                //check each setting:
                fluid.each(solutionBlock.settings, function (expectedValue, settingKey) {
                    var responseValue = response.checking[solutionIndex].settings[settingKey];
                    jqUnit.assertEquals("Check setting "+settingKey, expectedValue, responseValue);
                });
            });
        });
    };

    var addRESTTest = function(token, action, onEnd) {
        //test login with token
        integrationTester.asyncTest("Test "+token+" "+action, function () {
            http.get({
                host: "localhost",
                port: 8081,
                path: "/user/"+token+"/"+action
            }, function(response) {
                var data = "";
                fluid.log("Callback from use "+action+" called");

                response.on("data", function (chunk) {
                    fluid.log("Response from server: " + chunk);
                    data += chunk;
                });
                response.on("close", function(err) {
                    if (err) {
                        jqUnit.assertFalse("Got an error on "+action+": " + err.message, true);
                        jqUnit.start();
                    }
                    fluid.log("Connection to the server was closed");
                });
                response.on("end", function() {
                    fluid.log("Connection to server ended");
                    onEnd(data);
                });
            }).on('error', function(err) {
                fluid.log("Got error: " + err.message);
                jqUnit.start();
            });
        });
    };

    gpii.flowManager();
    var tokenQueue = Object.keys(integrationTestsJSON);
    
    var testNextToken = function() {
        if (tokenQueue.length === 0) {
            return;
        }

        var token = tokenQueue.pop();
        var json = integrationTestsJSON[token];

        //Setup and check an initial known state:
        //Made asynchronous due to qunit bug that doesn't allow synchronous tests
        integrationTester.asyncTest("Set up initial state", function() {
            setSettings(json.initialState);
            setTimeout(function() {
                checkSettings(json.initialState);
                jqUnit.start();
            }, 1);
        });

        //test login:
        addRESTTest(token, "login", function (data) {
        jqUnit.assertNotEquals("Successful login message returned", data.indexOf("User was successfully logged in."), -1);
            checkSettings(json.loggedInState);
            //test logout:
            addRESTTest(token, "logout", function (data) {
                jqUnit.assertNotEquals("Successful logout message returned", data.indexOf("successfully logged out."), -1);
                checkSettings(json.initialState);
                //let the system know we're ready for another test:
                testNextToken();
                jqUnit.start();
            });
            jqUnit.start();
        });
    };

    testNextToken();
}());