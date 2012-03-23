(funciton () {

    var fluid = require("infusion");
    var gpii = fluid.registerNamespace("gpii");

    fluid.require("universal", require);
    fluid.require("linux", require);

    gpii.flowManager();

})();