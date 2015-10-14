'use strict';

/**
 * Lazily required module dependencies
 */

var lazy = require('lazy-cache')(require);
var fn = require;

require = lazy;
require('mixin-deep', 'merge');
require('question-cache', 'questions');
require('ask-once', 'ask');
require = fn;

/**
 * Expose `lazy`
 */

module.exports = lazy;
