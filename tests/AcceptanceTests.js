/*

GPII acceptance Testing

Copyright 2013 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global __dirname, require*/

"use strict";
var fluid = require("universal"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii");

require("gsettingsBridge");
require("orca");

fluid.registerNamespace("fluid.tests");

require(__dirname + "/../../node_modules/universal/tests/AcceptanceTests.js");

var configPath = path.resolve(__dirname, "./acceptanceTests/setup1/configs");
var gpiiConfig = {
   nodeEnv: "development-config",
   configPath: configPath
};

var testDefs = [
    {
        name: "Testing Mikel Vargas using Flat matchmaker (onscreen keyboard)",
        gpiiConfig: gpiiConfig,
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
                expectConfigured: "true",
                expectRestored: "false"
            }
        ]
    },
    {
        name: "Testing Sammy using Flat matchmaker",
        gpiiConfig: gpiiConfig,
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
                        "text-scaling-factor": 2
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
                expectConfigured: "true",
                expectRestored: "false"
            }
        ]
    },
    {
        name: "Testing os_common using Flat matchmaker",
        gpiiConfig: gpiiConfig,
        token: "os_common",
        settingsHandlers: {
           "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen",
                        "show-cross-hairs": false
                     },
                     "options": {
                         "schema": "org.gnome.desktop.a11y.magnifier"
                    },
                } , {
                    "settings": {
                        "gtk-theme": "HighContrast",
                        "icon-theme": "HighContrast",
                        "text-scaling-factor": 0.75,
                        "cursor-size": 41
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
                    }
                }]
            }
        },
        processes: [
            {
                command: "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
                expectConfigured: "true",
                expectRestored: "false"
            }
        ]
    },
    {
        name: "Testing os_gnome using Flat matchmaker",
        gpiiConfig: gpiiConfig,
        token: "os_gnome",
        settingsHandlers: {
           "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen",
                        "show-cross-hairs": false
                     },
                     "options": {
                         "schema": "org.gnome.desktop.a11y.magnifier"
                    },
                } , {
                    "settings": {
                        "text-scaling-factor": 0.75,
                        "cursor-size": 90
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
                    }
                }]
            }
        },
        processes: [
            {
                command: "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
                expectConfigured: "true",
                expectRestored: "false"
            }
        ]
    },
    {
        name: "Testing os_win7 using Flat matchmaker",
        gpiiConfig: gpiiConfig,
        token: "os_win7",
        settingsHandlers: {
           "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen"
                     },
                     "options": {
                         "schema": "org.gnome.desktop.a11y.magnifier"
                    },
                } , {
                    "settings": {
                        "gtk-theme":"HighContrast",
                        "icon-theme":"HighContrast",
                        "cursor-size": 41
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
                    }
                }]
            }
        },
        processes: [
            {
                command: "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
                expectConfigured: "true",
                expectRestored: "false"
            }
        ]
    },
    {
        name: "Testing screenreader_common using Flat matchmaker",
        gpiiConfig: gpiiConfig,
        token: "screenreader_common",
        settingsHandlers: {
            "gpii.orca": {
               "data": [{
                    "settings": {
                        "sayAllStyle": 1,
                        "enableEchoByWord": true,
                        "enableEchoByCharacter": false,
                        "enableTutorialMessages": false,
                        "verbalizePunctuationStyle": 0,
                        "enableSpeech": true,
                        "voices" : {
                            "default" : {
                                "established": false,
                                "rate": 102.27272727272727,
                                "family": {
                                    "locale": "en",
                                    "name": "en-westindies"
                                },

                            },
                            "uppercase": { "average-pitch": 7 },
                            "system": { "established": false },
                            "hyperlink": { "established": false }
                        }
                    },
                    "options": {
                        "user": "screenreader_common"
                    }
                } ]
            }
        },
        processes: [
            {
                command: "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                expectConfigured: "true",
                expectRestored: "false"
            }
        ]
    },
    {
        name: "Testing screenreader_orca using Flat matchmaker",
        gpiiConfig: gpiiConfig,
        token: "screenreader_orca",
        settingsHandlers: {
            "gpii.orca": {
               "data": [{
                    "settings": {
                        "sayAllStyle": 1,
                        "enableEchoByWord": true,
                        "enableEchoByCharacter": false,
                        "enableTutorialMessages": false,
                        "verbalizePunctuationStyle": 0,
                        "voices" : {
                            "default" : {
                                "established": false,
                                "rate": 102.27272727272727,
                                "family": {
                                    "locale": "en",
                                    "name": "en-westindies"
                                }
                            },
                            "uppercase": { "average-pitch": 7 },
                            "system": { "established": false },
                            "hyperlink": { "established": false }
                        }
                    },
                    "options": {
                        "user": "screenreader_orca"
                    }
                } ]
            }
        },
        processes: [
            {
                command: "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                expectConfigured: "true",
                expectRestored: "false"
            }
        ]
    },
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        gpiiConfig: gpiiConfig,
        token: "screenreader_nvda",
        settingsHandlers: {
            "gpii.orca": {
               "data": [{
                    "settings": {
                        "sayAllStyle": 1,
                        "enableEchoByWord": true,
                        "enableEchoByCharacter": false,
                        "enableTutorialMessages": false,
                        "verbalizePunctuationStyle": 0,
                        "voices" : {
                            "default" : {
                                "established": false,
                                "rate": 102.27272727272727,
                                "family": {
                                    "locale": "en",
                                    "name": "en-westindies"
                                },

                            },
                            "uppercase": { "average-pitch": 7 },
                            "system": { "established": false },
                            "hyperlink": { "established": false }
                        }
                    },
                    "options": {
                        "user": "screenreader_nvda"
                    }
                }]
            }
        },
        processes: [
            {
                command: "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                expectConfigured: "true",
                expectRestored: "false"
            }
        ]
    }
];

gpii.acceptanceTesting.runTests(testDefs, gpiiConfig);
