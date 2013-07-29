/*

GPII Integration Testing

Copyright 2013 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global __dirname, require*/
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
    },
    {
        name: "Testing Sammy using Flat matchmaker",
        gpiiConfig: {
            nodeEnv: "development-config",
            configPath: __dirname+"/integrationTests/setup1/configs"
        },
        token: "sammy",
        settingsHandlers: {
            "gpii.gsettings": {
               "data": [{
                    "settings": {
                        "mag-factor": 2,
                        "mouse-tracking": "centered"
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
                    }
                }, {
                   "settings": {
                        "text-scaling-factor":1
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
                    }
                } ]
            }
        },
        processes: [
            {
                command: "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
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
        jqUnit = fluid.require("jqUnit"),
        child_process = require('child_process');

    require("../../node_modules/universal/gpii/node_modules/testFramework/gpiiTests.js");
    require("gsettingsBridge");

    fluid.registerNamespace("gpii.integrationTesting");

    fluid.registerNamespace("fluid.tests");

    fluid.defaults("gpii.integrationTesting.exec", {
        gradeNames: ["fluid.littleComponent", "autoInit", "fluid.eventedComponent"],
        events: {
            onExit: null
        }
    });

    gpii.integrationTesting.exec.preInit = function (that) {
        that.exec = function (processSpec) {
            var output = "";
            var cp = child_process.exec(processSpec.command);
            cp.stdout.on("data", function (data) {
                output += data;
            });
            cp.on("exit", function (exitCode) {
                that.events.onExit.fire(exitCode, output, processSpec);
            });
            cp.on("error", function (err) {
               jqUnit.assertFalse("Got an error on exec... " + err.message, true);            
            });
        };
    };

    fluid.defaults("gpii.integrationTesting.httpReq", {
        gradeNames: ["fluid.littleComponent", "autoInit", "fluid.eventedComponent"],
        events: {
            onLogin: null,
            onLogout: null
        }
    });

    gpii.integrationTesting.httpReq.preInit = function (that) {
        that.login = function (token) {
            that.call(token, "login", that.events.onLogin.fire);
        };
        that.logout = function (token) {
            that.call(token, "logout", that.events.onLogout.fire);
        };
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
                    callback(data, token);             
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
            exec: {
                type: "gpii.integrationTesting.exec"
            },
            integrationTests: {
                type: "gpii.integrationTesting.tests"
            }
        }
    });

    gpii.integrationTesting.buildTestFixtures = function (testDefs) {
        var testFixtures = [];

        fluid.each(testDefs, function (testDef, index) {
            var processes = testDef.processes;
            var testDefRef = "{integrationTests}.options.testDefs." + index;
            //First add common steps, ie:
            //Storing state, start server, logging in and checking that configuration is set
            var testFixture = {
                name: testDef.name,
                //number of asserts is 4 + number of checks for running processes
                expect: 4 + testDef.processes.length,
                sequence: [ {
                    func: "gpii.integrationTesting.startServer",
                    args: [ testDefRef, "{integrationTests}" ]
                }, {
                    func: "gpii.integrationTesting.initSettings",
                    args: [ testDefRef, "{integrationTests}.options.settingsStore" ]
                }, {
                    func: "{httpReq}.login",
                    args: [ testDefRef + ".token" ]
                }, {
                    listener: "gpii.integrationTesting.loginRequestListen",
                    event: "{httpReq}.events.onLogin"
                }, {
                    func: "gpii.integrationTesting.checkConfiguration",
                    args: [ testDefRef ]
                }]
            };
            //For each process, run the command, then check that we get the expected output
            fluid.each(processes, function (process, pindex) {
                testFixture.sequence.push({
                    func: "{exec}.exec",
                    args: [ testDefRef + ".processes." + pindex]
                }, {
                    listener: "gpii.integrationTesting.onExecExit",
                    event: "{exec}.events.onExit"
                });
            });
            //Back to the common steps:
            //Logout, check that configuration is properly restored
            testFixture.sequence.push({ 
                    func: "{httpReq}.logout",
                    args: [ testDefRef + ".token" ]
                }, {
                    listener: "gpii.integrationTesting.logoutRequestListen",
                    event: "{httpReq}.events.onLogout"
                }, {
                    func: "gpii.integrationTesting.checkRestoredConfiguration",
                    args: [ testDefRef, "{integrationTests}.options.settingsStore"]
                }, {
                    func: "gpii.integrationTesting.stopServer",
                    args: [ "{integrationTests}" ]
                });

            testFixtures.push(testFixture);
        });
        return testFixtures;
    };

    fluid.defaults("gpii.integrationTesting.tests.server", {
        gradeNames: ["autoInit", "fluid.littleComponent", "{that}.buildServerGrade"],
        invokers: {
            buildServerGrade: {
                funcName: "fluid.identity",
                "args": [ "{gpii.integrationTesting.tests}.componentName" ]
            }
        }
    });

    gpii.integrationTesting.tester = function (a, b, c) {
        console.log(a);
        var b = a;
    }

    fluid.defaults("gpii.integrationTesting.tests", {
        gradeNames: ["fluid.test.testCaseHolder", "fluid.eventedComponent", "autoInit"],
        testDefs: testDefs,
        gpii: null,
        settingsStore: {},
        components: {
            gpii: {
                type: "gpii.integrationTesting.tests.server",
                createOnEvent: "createServer"
            }
        },
        events: {
            createServer: null
        },
        modules: [ {
            name: "Full login/logout cycle",
            tests: gpii.integrationTesting.buildTestFixtures(testDefs)
        }]
    });
    
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

    gpii.integrationTesting.startServer = function (testDef, tests) {
        //TODO: remove once server is properly stopped
        if (testDef.token === "MikelVargas") {
            tests.componentName = gpii.config.createDefaults(testDef.gpiiConfig);
            tests.events.createServer.fire();
        }
    };
    gpii.integrationTesting.initSettings = function (testDef, settingsStore) {
        settingsStore.orig = gpii.integrationTesting.getSettings(testDef.settingsHandlers);
    };
    gpii.integrationTesting.loginRequestListen = function (data, token) {
        jqUnit.assertNotEquals("Successful login message returned "+data, data.indexOf("User with token "+token+" was successfully logged in."), -1);                
    };
    gpii.integrationTesting.checkConfiguration = function (testDef) {
        var config = gpii.integrationTesting.getSettings(testDef.settingsHandlers);
        jqUnit.assertDeepEq("Checking that settings are set", config, testDef.settingsHandlers);
    };
    gpii.integrationTesting.onExecExit = function (exitCode, output, processSpec) {
        jqUnit.assertEquals("Checking that the process "+processSpec.command+" is running", output.trim(), processSpec.expect);
    };
    gpii.integrationTesting.logoutRequestListen = function (data, token) {
        jqUnit.assertNotEquals("Successful logout message returned "+data, data.indexOf("User with token "+token+" was successfully logged out."), -1);                
    };
    gpii.integrationTesting.checkRestoredConfiguration = function (testDef, settingsStore) {
        var currentSettings = gpii.integrationTesting.getSettings(testDef.settingsHandlers);
        jqUnit.assertDeepEq("Checking that settings are properly reset", currentSettings, settingsStore.orig);
    };
    gpii.integrationTesting.stopServer = function (tests) {
        // var instantiator = fluid.getInstantiator(tests.gpii);
        // instantiator.clearComponent(tests.gpii, "server");
        // var a = tests;
    };
    fluid.tests.testTests = function () {
        fluid.test.runTests([
            "gpii.integrationTesting.testEnv"
        ]);
    };

    fluid.tests.testTests();
})();