module.exports = function(grunt) {
    function nodeGypCompileShell(dir) {
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
    }; 

    function nodeGypCleanShell(dir) {
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
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        shell: {
            compileGSettings: nodeGypCompileShell("node_modules/gsettingsBridge/nodegsettings"),
            cleanGSettings: nodeGypCleanShell("node_modules/gsettingsBridge/nodegsettings"),
            compileAlsaBridge: nodeGypCompileShell("node_modules/alsa/nodealsa"),
            cleanAlsaBridge: nodeGypCleanShell("node_modules/alsa/nodealsa"),
            compileXrandrBridge: nodeGypCompileShell("node_modules/xrandr/nodexrandr"),
            cleanXrandrBridge: nodeGypCleanShell("node_modules/xrandr/nodexrandr"),
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

    grunt.registerTask('build', "Build the entire GPII", function() {
        grunt.task.run("gpiiUniversal");
        grunt.task.run("shell:compileGSettings");        
        grunt.task.run("shell:compileAlsaBridge");        
        grunt.task.run("shell:compileXrandrBridge");        
    });

    grunt.registerTask("clean", "Clean the GPII binaries and uninstall", function() {
        grunt.task.run("shell:cleanGSettings");
        grunt.task.run("shell:cleanAlsaBridge");
        grunt.task.run("shell:cleanXrandrBridge");
    }); 

    grunt.registerTask("start", "Start the GPII", function() {
        grunt.task.run("shell:startGpii");
    });
};
