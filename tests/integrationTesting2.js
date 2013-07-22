/*

GPII Integration Testing

Copyright 2013 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt

*/

var testDefs = [
    {
        name: "Testing Mikel Vargas using Flat matchmaker (onscreen keyboard)",
        gpiiConfig: {
            nodeEnv: "development-config",
            configPath: __dirname+"/integrationTests/setup1/configs"
        },
        token: "MikelVargas",
        settingsHandlers: {
           "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "slowkeys-delay": 400,
                        "slowkeys-enable": true,
                        "bouncekeys-delay": 200,
                        "mousekeys-enable": true,
                        "stickykeys-enable": true,
                        "bouncekeys-enable": true,
                        "mousekeys-max-speed": 850,
                        "mousekeys-init-delay": 120,
                        "mousekeys-accel-time": 800
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.keyboard"
                    }
                }]
            }
        },
        processes: [
            {
                command: "gsettings get org.gnome.desktop.a11y.applications screen-keyboard-enabled",
                expect: "true"
            }
        ]
    }
];

(function () {
    "use strict";
    var fluid = require("universal"),
        http = require("http"),
        gpii = fluid.registerNamespace("gpii"),
        jqUnit = fluid.require("jqUnit");

    require("../../node_modules/universal/gpii/node_modules/testFramework/gpiiTests.js");
    require("gsettingsBridge");
    /** Testing environment - holds both fixtures as well as components under test, exposes global test driver **/

    fluid.registerNamespace("gpii.integrationTesting");

    fluid.registerNamespace("fluid.tests");


    fluid.defaults("gpii.integrationTesting.httpReq", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        postInitFunction: "gpii.integrationTesting.httpReq.postInit",
        events: {
            onLogin: null,
            onLogout: null
        }
    });


    gpii.integrationTesting.httpReq.postInit = function (that) {
        that.login = function (token) {
            that.call(token, "login", that.events.onLogin.fire);
        }

        that.call = function (token, action, callback) {
            http.get({
                host: "localhost",
                port: 8081,
                path: "/user/"+token+"/"+action
            }, function(response) {
                var data = "";

                response.on("data", function (chunk) {
                    data += chunk;
                });
                response.on("close", function(err) {
                    if (err) {
                        jqUnit.assertFalse("Got an error on "+action+": " + err.message, true);
                        // jqUnit.start();
                    }
                    fluid.log("Connection to the server was closed");
                });
                response.on("end", function() {
                    callback(data)                
                });
            }).on('error', function(err) {
                jqUnit.assertFalse("Got an error on "+action+": " + err.message, true);            
            });
        };
    };

    fluid.defaults("gpii.integrationTesting.testEnv", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            httpReq: {
                type: "gpii.integrationTesting.httpReq"
            },
            integrationTests: {
                type: "gpii.integrationTesting.tests"
            }
        }
    });

    /** Test Case Holder - holds declarative representation of test cases **/

    fluid.defaults("gpii.integrationTesting.tests", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testDefs: testDefs[0],
        gpii: null,
        settingsStore: {},
        modules: [ /* declarative specification of tests */ {
            name: "Cat test case",
            tests: [
            {
                name: "Config process",
                expect: 2,
                sequence: [ {
                    func: "gpii.integrationTesting.initSettings",
                    args: [ "{integrationTests}.options.testDefs", "{integrationTests}.options.settingsStore" ]
                }, {
                    func: "gpii.integrationTesting.login",
                    args: [ "{httpReq}", "{integrationTests}.options.testDefs.token" ]
                }, {
                    listener: "gpii.integrationTesting.loginListen",
                    event: "{httpReq}.events.onLogin"
                }
                ]
            }]
        }]
    });

    gpii.integrationTesting.tests.preInit = function (that) {
        that.options.gpii = gpii.config.makeConfigLoader(that.options.testDefs.gpiiConfig);
    };


    /*
    * Sets the settings given in the json paramater. The content of the json passed
    * is the values to set in a format similar to the content of 'initialState'
    */
    gpii.integrationTesting.getSettings = function (payload) {
        var ret = {};
        fluid.each(payload, function (handlerBlock, handlerID) {
            ret[handlerID]=fluid.invokeGlobalFunction(handlerID+".get", [handlerBlock]);
        });
        return ret;
    };

    gpii.integrationTesting.initSettings = function (testDef, settingsStore) {
        settingsStore.orig = gpii.integrationTesting.getSettings(testDef.settingsHandlers);
    };
    gpii.integrationTesting.login = function (httpReq, token) {
        httpReq.login(token);
    }
    gpii.integrationTesting.loginListen = function (data) {
        jqUnit.assertNotEquals("Successful login message returned "+data, data.indexOf("User with token "+token+" was successfully logged in."), -1);                
    }
    fluid.tests.testTests = function () {
        fluid.test.runTests([
            "gpii.integrationTesting.testEnv"
        ]);
    };

    fluid.tests.testTests();
})();