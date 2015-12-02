/*
 * grunt-qunit-node
 * https://github.com/mucaho/grunt-qunit-node
 *
 * Copyright (c) 2017 mucaho
 * Licensed under the MIT license.
 */

'use strict';

var inspect = require('util').inspect,
    EOL = require('os').EOL;

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        all: [
            'Gruntfile.js',
            'tasks/*.js',
            '<%= nodeunit.test %>',
            '<%= grunt.config("qunit-node.fixture.src") %>'
        ],

        jsvalidate: {
            all: ['<%= all %>'],
            options: {
                globals: {},
                esprimaOptions: {},
                verbose: false
            }
        },

        jshint: {
            all: ['<%= all %>'],
            options: {
                jshintrc: true
            }
        },

        jscs: {
            all: ['<%= all %>'],
            options: {
                config: true,
                fix: false, // Autofix code style violations when possible.
                extract: ['*.htm', '*.html']
            }
        },

        nodeunit: {
            test: 'test/qunit-node-test.js'
        },

        // Configuration to be tested.
        'qunit-node': { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
            options: {
                dummy1: 'task-level',
                dummy2: 'task-level'
            },
            fixture: {
                src: 'test/qunit-node-fixture.js',
                options: {
                    dummy1: 'target-level',
                    autostart: true,
                    setup: function (qunit) {
                        qunit.on('runEnd', function (data) {
                            grunt.option('grunt-qunit-node.fixture.data', data);
                        });
                        qunit.on('testEnd', function (testEnd) {
                            testEnd.errors.forEach(function (error) {
                                var actual = inspect(error.actual),
                                    expected = inspect(error.expected),
                                    reason = 'Actual value ' + actual +
                                             ' does not match expected value ' + expected,
                                    message = 'Description: ' + error.message + EOL +
                                              'Reason: ' + reason + EOL +
                                              'Stack: ' + error.stack;

                                grunt.log.errorlns(message);
                            });
                        });
                    }
                }
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-jsvalidate');

    // Whenever the "test" task is run, first run this plugin's task(s), then test the result.
    grunt.registerTask('test', [
        'jsvalidate', 'jshint', 'jscs', 'record-events', 'qunit-node:fixture', 'nodeunit'
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['test']);

    // test helper to propagate events to nodeunit
    grunt.registerTask('record-events', 'Records events emitted by grunt-qunit-node.', function () {
        var baseName = 'grunt-qunit-node.fixture';

        grunt.event.once(baseName + '.start', function (qunit) {
            grunt.option(baseName + '.qunit', qunit);
            grunt.event.once(baseName + '.end', function (passed, failed, total) {
                grunt.option(baseName + '.event.passed', passed);
                grunt.option(baseName + '.event.failed', failed);
                grunt.option(baseName + '.event.total', total);
            });
        });
    });
};
