# grunt-qunit-node

> Simple Grunt task that runs QUnit tests in Node.js

## Getting Started
This plugin requires Grunt `>=0.4.0`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-qunit-node --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-qunit-node');
```

This plugin has a peer dependency on `qunitjs` in version `^2.0.0`. If you haven't already installed it, run this command:

```shell
npm install qunitjs --save-dev
```

## The "qunit-node" task

### Overview
In your project's Gruntfile, add a section named `qunit-node` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'qunit-node': {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.setup   
Type: `Function`   
Default value: `function (QUnit) { }`   

Specify a callback function which will be called before QUnit starts the tests.   
This grunt task doesn't log individual test or module results, just the end result.   
Therefore, it is a good place to register callbacks on the `QUnit` argument, e.g. with `QUnit.on(...)`.   
See [callbacks/QUnit.on](http://api.qunitjs.com/callbacks/QUnit.on) for details.

#### options.\<anyOtherProperty\>   
Type: `any`   

Any other property of the `config` object will be directly set on `QUnit.config`.   
See [config/QUnit.config](http://api.qunitjs.com/config/QUnit.config) for details.

### Usage Examples

In your `package.json`:
```json
  ...,
  "devDependencies": {
    "grunt": "^1.0.1",
    "grunt-qunit-node": "^0.1.0",
    "qunitjs": "^2.3.0"
  },
  "scripts": {
    "test": "grunt test"
  },
  ...
```

Install
```shell
$ npm install
```

In your `Gruntfile.js`:
```js
var inspect = require('util').inspect,
    EOL = require('os').EOL;

module.exports = function (grunt) {
  grunt.initConfig({
    'qunit-node': {
      options: {
        noglobals: true
      },
      test: {
        src: 'test/qunit-node-fixture.js',
        options: {
          requireExpects: true,
          setup: function (qunit) {
            qunit.on('testEnd', function (testEnd) {
              testEnd.errors.forEach(function (error) {
                var actual = inspect(error.actual),
                    expected = inspect(error.expected),
                    reason = 'Actual value ' + actual + ' does not match expected value ' + expected,
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

  grunt.loadNpmTasks('grunt-qunit-node');
  grunt.registerTask('test', ['qunit-node:test']);
};
```

In `test/qunit-node-fixture.js`:
```js
QUnit.test('a basic test example', function (assert) {
  assert.expect(1);
  var value = 'hello';
  assert.equal(value, 'hello', 'We expect value to be hello');
});
```

Run the tests
```shell
$ npm test
```

## Contributing

```shell
$ git clone https://github.com/mucaho/grunt-qunit-node.git
$ cd grunt-qunit-node
$ npm install
```
Modify code.   
Add unit tests for any new or changed functionality.   
```shell
$ npm test
```

## Release History
0.0.1: Initial version
