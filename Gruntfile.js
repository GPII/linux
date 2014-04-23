module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        shell: {
            compileGSettings: {
                options: {
                    stdout: true,
                    stderr: true,
                    execOptions: {
                        cwd: "node_modules/gsettingsBridge/nodegsettings"
                    }
                },
                command: function() {
                    return "node-gyp configure build"; 
                }
            },
            compileAlsaBridge: {
                options: {
                    stdout: true,
                    stderr: true,
                    execOptions: {
                        cwd: "node_modules/alsa/nodealsa"
                    }
                },
                command: function() {
                    return "node-gyp configure build"; 
                }
            },
            compileXrandrBridge: {
                options: {
                    stdout: true,
                    stderr: true,
                    execOptions: {
                        cwd: "node_modules/xrandr/nodexrandr"
                    }
                },
                command: function() {
                    return "node-gyp configure build"; 
                }
            },
        }
    });

    grunt.loadNpmTasks("grunt-gpii");

    grunt.registerTask('buildall', "Build the entire GPII", function() {
        grunt.task.run("gpiiUniversal");
        grunt.task.run("shell:compileGSettings");        
        grunt.task.run("shell:compileAlsaBridge");        
        grunt.task.run("shell:compileXrandrBridge");        
    });
};
