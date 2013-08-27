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
    },
    {
        name: "Testing orca1 using Flat matchmaker",
        gpiiConfig: {
            nodeEnv: "development-config",
            configPath: __dirname+"/integrationTests/setup1/configs"
        },
        token: "orca1",
        settingsHandlers: {
            "gpii.orca": {
               "data": [{
                    "settings": {
                        "sayAllStyle": 0,
                        "enableSpeech": true,
                        "enableBraille": true,
                        "enableEchoByWord": true,
                        "enableEchoByCharacter": false,
                        'voices.default.rate': 90.9090909090909,
                        "enableTutorialMessages": false,
                        'voices.default.family': { "locale": 'es', "name": 'spanish-latin-american' },
                        "verbalizePunctuationStyle": 0
                    },
                    "options": {
                        "user": "orca1"
                    }
                } ]
            }
        },
        processes: [
        ]
    }
];

(function () {
    "use strict";
    var fluid = require("universal"),
        gpii = fluid.registerNamespace("gpii");
        
    require("gsettingsBridge");
    require("orca");

    fluid.registerNamespace("fluid.tests");

    require(__dirname+"/../../node_modules/universal/tests/IntegrationTests.js");

    fluid.defaults("gpii.integrationTesting.tests", {
        gradeNames: ["fluid.test.testCaseHolder", "fluid.eventedComponent", "autoInit"],
        testDefs: testDefs,
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

    fluid.tests.testTests = function () {
        fluid.test.runTests([
            "gpii.integrationTesting.testEnv"
        ]);
    };

    fluid.tests.testTests();
})();
