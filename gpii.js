/*
 * GPII Windows Personalization Framework Node.js Bootstrap
 *
 * Copyright 2012 OCAD University
 * Copyright 2014 Lucendo Development Ltd.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/linux/blob/master/LICENSE.txt
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 */

"use strict";

var fluid = require("gpii-universal"),
    gpii = fluid.registerNamespace("gpii");

require("./index.js");

gpii.start();
