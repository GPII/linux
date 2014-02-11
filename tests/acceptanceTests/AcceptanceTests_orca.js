/*

GPII Acceptance Testing

Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require,process*/

"use strict";
var fluid = require("universal"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("./AcceptanceTests_include", require);

var testDefs = [
    {
        name: "Testing screenreader_common using Flat matchmaker",
        token: "screenreader_common",
        settingsHandlers: {
            "gpii.orca": {
                "data": [
                    {
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
                                    "average-pitch": 1.5,
                                    "gain": 7.5,
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
                            "user": "screenreader_common"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ]
    },
    {                                                                                               
        name: "Testing screenreader_orca using Flat matchmaker",
        token: "screenreader_orca",
        settingsHandlers: {
            "gpii.orca": {
                "data": [
                    {
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
                                    "average-pitch": 1.5,
                                    "gain": 7.5,
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
                    }
                ]
            }
        },
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ]
    },
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        token: "screenreader_nvda",
        settingsHandlers: {
            "gpii.orca": {
                "data": [
                    {
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
                            "user": "screenreader_nvda"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ]
    } 
];

gpii.acceptanceTesting.linux.runTests("orca_config", testDefs);
