/*!
GPII Linux Personalization Framework Node.js Bootstrap

Copyright 2014 RTF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";

module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-gpii");

    var usbListenerDir = "./usbDriveListener";

    function nodeGypShell(cmd, cwd) {
        return {
            options: {
                execOptions: {
                    cwd: cwd
                }
            },
            command: cmd
        };
    }

    grunt.initConfig({
        jshint: {
            src: ["gpii/**/*.js", "tests/**/*.js"],
            buildScripts: ["Gruntfile.js"],
            options: {
                jshintrc: true
            }
        },
        jsonlint: {
            src: ["gpii/**/*.json", "tests/**/*.json"]
        },
        shell: {
            options: {
                stdout: true,
                stderr: true,
                failOnError: true
            },
            compileGSettings: nodeGypShell("node-gyp configure build", "gpii/node_modules/gsettingsBridge/nodegsettings"),
            cleanGSettings: nodeGypShell("node-gyp clean", "gpii/node_modules/gsettingsBridge/nodegsettings"),
            compileAlsaBridge: nodeGypShell("node-gyp configure build", "gpii/node_modules/alsa/nodealsa"),
            cleanAlsaBridge: nodeGypShell("node-gyp clean", "gpii/node_modules/alsa/nodealsa"),
            compileXrandrBridge: nodeGypShell("node-gyp configure build", "gpii/node_modules/xrandr/nodexrandr"),
            cleanXrandrBridge: nodeGypShell("node-gyp clean", "gpii/node_modules/xrandr/nodexrandr"),
            installUsbLib: {
                command: [
                    "sudo cp " + usbListenerDir + "/gpii-usb-user-listener /usr/bin/",
                    "sudo cp " + usbListenerDir +
                        "/gpii-usb-user-listener.desktop /usr/share/applications/",
                    "sudo mkdir -p /var/lib/gpii",
                    "sudo touch /var/lib/gpii/log.txt",
                    "sudo chmod a+rw /var/lib/gpii/log.txt"
                ].join("&&")
            },
            uninstallUsbLib: {
                command: [
                    "sudo rm /usr/bin/gpii-usb-user-listener",
                    "sudo rm /usr/share/applications/gpii-usb-user-listener.desktop",
                    "sudo rm -f -r /var/lib/gpii"
                ].join("&&")
            },
            startGpii: {
                command: "node gpii.js"
            }
        }
    });

    grunt.registerTask("build", "Build the entire GPII", function () {
        grunt.task.run("gpii-universal");
        grunt.task.run("shell:compileGSettings");
        grunt.task.run("shell:compileAlsaBridge");
        grunt.task.run("shell:compileXrandrBridge");
        grunt.task.run("shell:installUsbLib");
    });

    grunt.registerTask("clean", "Clean the GPII binaries and uninstall", function () {
        grunt.task.run("shell:cleanGSettings");
        grunt.task.run("shell:cleanAlsaBridge");
        grunt.task.run("shell:cleanXrandrBridge");
        grunt.task.run("shell:uninstallUsbLib");
    });

    grunt.registerTask("start", "Start the GPII", function () {
        grunt.task.run("shell:startGpii");
    });

    grunt.registerTask("install", "Install system level GPII Components", function () {
        grunt.task.run("shell:installUsbLib");
    });

    grunt.registerTask("uninstall", "Uninstall system level GPII Components", function () {
        grunt.task.run("shell:uninstallUsbLib");
    });
};
