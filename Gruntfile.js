/*!
GPII Linux Personalization Framework Node.js Bootstrap

Copyright 2014 RTF-US
Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/linux/blob/master/LICENSE.txt
*/

"use strict";

module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("fluid-grunt-eslint");

    var usbListenerDir = "./usbDriveListener";
    var gypCompileCmd = "node-gyp configure build";
    var gypCleanCmd = "node-gyp clean";
    var pkgdata = require('./package.json');

    var currentArch = (function() {
        if (process.arch == 'ia32')
            return 'i386';
        else if (process.arch == 'x64')
            return "x86_64";
        else
            return "noarch";
    })();

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

    grunt.registerTask("lint", "Apply eslint and jsonlint", ["eslint", "jsonlint"]);

    grunt.initConfig({
        eslint: {
            src: ["./gpii/**/*.js", "./tests/**/*.js", "./*.js"]
        },
        jsonlint: {
            src: ["gpii/**/*.json"]
        },
        appFileName: "gpii-linux",
        buildDir: "build",
        pkgdata: pkgdata,
        shell: {
            options: {
                stdout: true,
                stderr: true,
                failOnError: true,
                // A large maxBuffer value is required for the 'runAcceptanceTests' task otherwise
                // a 'stdout maxBuffer exceeded' warning is generated.
                execOptions: {
                    maxBuffer: 1000 * 1024
                }
            },
            compileGSettings: nodeGypShell(gypCompileCmd, "gpii/node_modules/gsettingsBridge/nodegsettings"),
            cleanGSettings: nodeGypShell(gypCleanCmd, "gpii/node_modules/gsettingsBridge/nodegsettings"),
            compileAlsaBridge: nodeGypShell(gypCompileCmd, "gpii/node_modules/alsa/nodealsa"),
            cleanAlsaBridge: nodeGypShell(gypCleanCmd, "gpii/node_modules/alsa/nodealsa"),
            compileXrandrBridge: nodeGypShell(gypCompileCmd, "gpii/node_modules/xrandr/nodexrandr"),
            cleanXrandrBridge: nodeGypShell(gypCleanCmd, "gpii/node_modules/xrandr/nodexrandr"),
            compilePackageKitBridge: nodeGypShell(gypCompileCmd, "gpii/node_modules/packagekit/nodepackagekit"),
            cleanPackageKitBridge: nodeGypShell(gypCleanCmd, "gpii/node_modules/packagekit/nodepackagekit"),
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
                    "sudo rm -f /usr/bin/gpii-usb-user-listener",
                    "sudo rm -f /usr/share/applications/gpii-usb-user-listener.desktop",
                    "sudo rm -f -r /var/lib/gpii"
                ].join("&&")
            },
            prepareRpmEnv: {
                command: "dnf install -y nodejs-grunt-cli npm alsa-lib-devel json-glib-devel PackageKit-glib-devel libXrandr-devel libgnome-keyring-devel sudo @development-tools rpmdevtools"
            },
            buildRpmDocker: {
                command: "docker run --rm -i -v $(pwd):/sync fedora /bin/bash -c 'dnf install -y nodejs-grunt-cli; cp -r /sync /packages; cd /packages; grunt build-rpm; cp -r /packages/bin /sync'"
            },
            runAcceptanceTests: {
                command: "vagrant ssh -c 'DISPLAY=:0 node /home/vagrant/sync/tests/AcceptanceTests.js'"
            },
            runUnitTests: {
                command: "vagrant ssh -c 'cd /home/vagrant/sync/tests/; DISPLAY=:0 ./UnitTests.sh'"
            }
        },
        easy_rpm: {
            options: {
                release: 1,
                summary: pkgdata.description,
                rpmDestination: "bin",
                tempDir: "bin/tmp",
                keepTemp: true,
                license: pkgdata.licenses[0].type,
                url: pkgdata.homepage,
                buildArch: currentArch,
                requires: [
                    "nodejs >= 0.10.42",
                    "python-httplib2"
                ]
            },
            release: {
                files: [
                    {src: "gpii.js", dest: "/opt/gpii-linux"},
                    {src: "index.js", dest: "/opt/gpii-linux"},
                    {src: "package.json", dest: "/opt/gpii-linux"},
                    {src: "gpii/**/*", dest: "/opt/gpii-linux"},
                    {src: "../node_modules/**/*", dest: "/opt/gpii-linux/node_modules"},
                    {src: "gpii-linux-autostart.desktop", dest: "/etc/xdg/autostart", cwd: 'build/resources'},
                    {src: "gpii-linux-start", dest: "/usr/bin", cwd: 'build/resources'},
                    {src: "/var/lib/gpii/log.txt", dest: "/", mode: 666},
                    {src: "gpii-usb-user-listener", dest: "/usr/bin", mode: "755", cwd: 'usbDriveListener'},
                    {src: "gpii-usb-user-listener.desktop", dest: "/usr/share/applications", cwd: 'usbDriveListener'}
                ],
                excludeFiles: [
                    "../node_modules/**/examples/switch-bench.js" //avoid strange dependency
                ]
            },
        }
    });

    grunt.registerTask("build", "Build the entire GPII", function () {
        grunt.task.run("build-addons");
        grunt.task.run("shell:installUsbLib");
    });

    grunt.registerTask("build-addons", "Build the native addons", function () {
        grunt.task.run("shell:compileGSettings");
        grunt.task.run("shell:compileAlsaBridge");
        grunt.task.run("shell:compileXrandrBridge");
        grunt.task.run("shell:compilePackageKitBridge");
    });

    grunt.registerTask("clean-addons", "Clean the native addons", function () {
        grunt.task.run("shell:cleanGSettings");
        grunt.task.run("shell:cleanAlsaBridge");
        grunt.task.run("shell:cleanXrandrBridge");
        grunt.task.run("shell:cleanPackageKitBridge");
    });

    grunt.registerTask("clean", "Clean the GPII binaries and uninstall", function () {
        grunt.task.run("clean-addons");
        grunt.task.run("shell:uninstallUsbLib");
    });

    grunt.registerTask("install", "Install system level GPII Components", function () {
        grunt.task.run("shell:installUsbLib");
    });

    grunt.registerTask("uninstall", "Uninstall system level GPII Components", function () {
        grunt.task.run("shell:uninstallUsbLib");
    });

    grunt.registerTask("unit-tests", "Run GPII unit tests", function () {
        grunt.task.run("shell:runUnitTests");
    });

    grunt.registerTask("acceptance-tests", "Run GPII acceptance tests", function () {
        grunt.task.run("shell:runAcceptanceTests");
    });

    grunt.registerTask("tests", "Run GPII unit and acceptance tests", function () {
        grunt.task.run("shell:runUnitTests");
        grunt.task.run("shell:runAcceptanceTests");
    });
    grunt.registerTask("build-rpm-docker", "Build Linux RPM package using a Docker container", function () {
        grunt.task.run("shell:buildRpmDocker");
    });
    grunt.registerTask("build-rpm", "Build GPII Linux and RPM package", function () {
        grunt.task.run("shell:prepareRpmEnv");
        grunt.task.run("build");
        grunt.task.run("easy_rpm");
    });
    grunt.loadNpmTasks("grunt-easy-rpm");
};
