/*!
GPII Linux Personalization Framework Node.js Bootstrap

Copyright 2014 RTF-US
Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

module.exports = function(grunt) {
    var usbListenerDir = "./usbDriveListener";

    function nodeGypCompileShell (dir) {
        return {
            options: {
                stdout: true,
                stderr: true,
                execOptions: {
                    cwd: dir
                }
            },
            command: function() {
                return "node-gyp configure build";
            }
        };
    }

    function nodeGypCleanShell (dir) {
        return {
            options: {
                stdout: true,
                stderr: true,
                execOptions: {
                    cwd: dir
                }
            },
            command: function() {
                return "node-gyp clean";
            }
        };
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        shell: {
            compileGSettings: nodeGypCompileShell("node_modules/gsettingsBridge/nodegsettings"),
            cleanGSettings: nodeGypCleanShell("node_modules/gsettingsBridge/nodegsettings"),
            compileAlsaBridge: nodeGypCompileShell("node_modules/alsa/nodealsa"),
            cleanAlsaBridge: nodeGypCleanShell("node_modules/alsa/nodealsa"),
            compileXrandrBridge: nodeGypCompileShell("node_modules/xrandr/nodexrandr"),
            cleanXrandrBridge: nodeGypCleanShell("node_modules/xrandr/nodexrandr"),
            compilePackageKitBridge: nodeGypCompileShell("node_modules/packagekit/nodepackagekit"),
            cleanPackageKitBridge: nodeGypCleanShell("node_modules/packagekit/nodepackagekit"),
            installUsbLib: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: [
                    "sudo cp " + usbListenerDir + "/gpii-usb-user-listener /usr/bin/",
                    "sudo cp " + usbListenerDir +
                        "/gpii-usb-user-listener.desktop /usr/share/applications/",
                    "sudo mkdir /var/lib/gpii"
                ].join("&&")
            },
            uninstallUsbLib: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: [
                    "sudo rm /usr/bin/gpii-usb-user-listener",
                    "sudo rm /usr/share/applications/gpii-usb-user-listener.desktop",
                    "sudo rm -f /var/lib/gpii"
                ].join("&&")
            },
            startGpii: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: function() {
                    return "node gpii.js";
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-gpii");

    grunt.registerTask("build", "Build the entire GPII", function () {
        grunt.task.run("gpiiUniversal");
        grunt.task.run("shell:compileGSettings");
        grunt.task.run("shell:compileAlsaBridge");
        grunt.task.run("shell:compileXrandrBridge");
        grunt.task.run("shell:compilePackageKitBridge");
        grunt.task.run("shell:installUsbLib");
    });

    grunt.registerTask("clean", "Clean the GPII binaries and uninstall", function () {
        grunt.task.run("shell:cleanGSettings");
        grunt.task.run("shell:cleanAlsaBridge");
        grunt.task.run("shell:cleanXrandrBridge");
        grunt.task.run("shell:cleanPackageKitBridge");
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
