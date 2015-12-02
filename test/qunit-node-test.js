'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  ```js
  exports.groupName = {
    setUp: function (done) {
      // setup before each test if necessary
      done();
    },
    tearDown: function (done) {
      // clean up before each test if necessary
      done();
    },
    testName: function (test) {
      test.expect(1);
      test.equal('foo', 'bar', 'should describe what the default behavior is.');
      test.done();
    }
  }
  ```

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['qunit-node'] = { // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
    default: function (test) {
        var baseName = 'grunt-qunit-node.fixture',
            qunit = global.QUnit;

        test.expect(10);

        // test option reporting
        test.strictEqual(grunt.option(baseName + '.passed'), 1, 'should report 1 passed test');
        test.strictEqual(grunt.option(baseName + '.failed'), 0, 'should report 0 failed tests');
        test.strictEqual(grunt.option(baseName + '.total'), 1, 'should report 1 total test');

        // test event reporting
        test.strictEqual(grunt.option(baseName + '.qunit'), qunit, 'should have emitted same instance');
        test.strictEqual(grunt.option(baseName + '.event.passed'), 1, 'should report 1 passed test');
        test.strictEqual(grunt.option(baseName + '.event.failed'), 0, 'should report 0 failed tests');
        test.strictEqual(grunt.option(baseName + '.event.total'), 1, 'should report 1 total test');

        // test setup callback
        var tests = grunt.option(baseName + '.data').testCounts;
        test.strictEqual(tests.passed + tests.failed, tests.total,
          'should have run custom setup callback');

        // test config modifications
        test.strictEqual(qunit.config.dummy1, 'target-level', 'should have applied config correctly');
        test.strictEqual(qunit.config.dummy2, 'task-level', 'should have applied config correctly');

        test.done();
    }
};
