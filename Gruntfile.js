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
        }
    } 

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        shell: {
            compileGSettings: nodeGypCompileShell("node_modules/gsettingsBridge/nodegsettings"),
            compileAlsaBridge: nodeGypCompileShell("node_modules/alsa/nodealsa"),
            compileXrandrBridge: nodeGypCompileShell("node_modules/xrandr/nodexrandr")
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
