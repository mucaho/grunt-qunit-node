/*
 * grunt-qunit-node
 * https://github.com/mucaho/grunt-qunit-node
 *
 * Copyright (c) 2017 mucaho
 * Licensed under the MIT license.
 */

'use strict';

var qunit = require('qunitjs'),
    path = require('path');

module.exports = function (grunt) {
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('qunit-node', 'Grunt task that runs QUnit tests in Node.js', function () {
        var done = this.async();
        // target specific event / option name
        var baseName = 'grunt-qunit-node.' + this.target;

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            // these properties will be directly set on QUnit.config
            // see http://api.qunitjs.com/config/QUnit.config

            setup: function (/* QUnit */) {
                // this callback will be invoked before QUnit is started
                // this task runner doesn't log individual test or module results, just the end result
                // this is a good place to register callbacks, e.g. with `QUnit.on(...)`
                // see http://api.qunitjs.com/callbacks/QUnit.on
            }
        });

        // setup QUnit
        global.QUnit = qunit;
        options.setup(qunit);

        // configure QUnit
        Object.keys(options).forEach(function (key) {
            qunit.config[key] = options[key];
        });
        qunit.config.autostart = false;

        // load QUnit tests
        this.filesSrc.forEach(function (file) {
            require(path.resolve(file));
        });
        if (this.filesSrc.length === 0) {
            grunt.fail.fatal('No valid test file paths!' +
                'The test files should be specified relative to your Gruntfile.');
        }

        // start & end QUnit
        qunit.done(function (details) {
            // set grunt options according to end result
            grunt.option(baseName + '.passed', details.passed);
            grunt.option(baseName + '.failed', details.failed);
            grunt.option(baseName + '.total', details.total);
            // emit grunt event end
            grunt.event.emit(baseName + '.end', details.passed, details.failed, details.total);

            if (details.failed === 0) {
                grunt.log.ok('' + details.passed + ' assertions passed.');
            } else {
                grunt.log.error('' + details.failed + ' assertions failed!');
            }

            done(details.failed === 0);
        });
        // emit grunt event start
        grunt.event.emit(baseName + '.start', qunit);
        qunit.start();
    });
};
