/*
 * GPII Node.js GSettings Bridge
 *
 * Copyright 2012 Steven Githens
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var util = require("util");
var assert = require("assert");
var gsettings = require("./build/Release/nodegsettings.node");

/* Common variables for all tests */
var keyScreenmag = "org.gnome.desktop.a11y.magnifier";

/* Test getting and setting boolean values */

var testBooleanValues = function () {
    var ret = gsettings.set_gsetting(keyScreenmag, "show-cross-hairs", true);
    assert.ok(ret);
    ret = gsettings.set_gsetting(keyScreenmag, "show-cross-hairs", false);
    assert.ok(ret);

    // Todo need to set up an event for these assertions, they run too fast,
    // and get the old value from gsettings before it's propagated.
    // exec('gsettings get '+keyScreenmag+' show-cross-hairs', function(res, out, err) {
    //     testBooleanValuesCallback1 = true;
    //     assert.equal('true\n', out);
    // });

    // exec('gsettings get '+keyScreenmag+' show-cross-hairs', function(res, out, err) {
    //     testBooleanValuesCallback2 = true;
    //     assert.equal('false\n', out);
    // });

};

var testDecimalValues = function () {
    var ret = gsettings.set_gsetting(keyScreenmag, "mag-factor", 3.0);
    assert.ok(ret);
    var ret2 = gsettings.set_gsetting(keyScreenmag, "mag-factor", 5.3);
    assert.ok(ret2);
};

var testStringToEnumValues = function () {
    var ret = gsettings.set_gsetting(keyScreenmag, "screen-position", "left-half");
    assert.ok(ret);
};

var testIntegerValues = function () {
    var ret = gsettings.set_gsetting(keyScreenmag, "cross-hairs-thickness", 7);
    assert.ok(ret);
};

/* Test Reading Values */
var testReadingDoubleValues = function () {
    var ret = gsettings.get_gsetting(keyScreenmag, "mag-factor");
    util.puts("The mag-factor is: " + ret);
};

var testReadingIntegerValues = function () {
    var ret = gsettings.get_gsetting(keyScreenmag, "cross-hairs-thickness");
    util.puts("The cross hairs thickness is: " + ret);
};

var testReadingStringValues = function () {
    var ret = gsettings.get_gsetting(keyScreenmag, "screen-position");
    util.puts("The screen-position is: " + ret);
};

var testStuff = function () {
    util.puts("Testing Stuff");
    var keys = gsettings.get_gsetting_keys(keyScreenmag);
    for (var i = 0; i < keys.length; i++) {
        util.puts("Ok: " + keys[i]);
    }
    util.puts("Done Testing Stuff");
};

testStuff();

/* Run test functions */
testBooleanValues();
testDecimalValues();
testStringToEnumValues();
testIntegerValues();
testReadingDoubleValues();
testReadingIntegerValues();
testReadingStringValues();
