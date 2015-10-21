/*!
 * assemble-ask <https://github.com/jonschlinkert/assemble-ask>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function (options) {
  var Ask = utils.ask;

  return function (app) {
    if (this.store && this.options.init) {
      this.store.del({force: true});
    }

    /**
     * add a `questions` property to the Verb instance
     * @type {Object}
     */

    options = utils.merge({}, this.options, options);
    this.questions = utils.questions(options);

    var ask = new Ask({
      questions: this.questions,
      store: this.store,
    });

    /**
     * Set a question to ask at a later point.
     */

    app.define('question', function () {
      this.questions.set.apply(this.questions, arguments);
      return this;
    });

    /**
     * Ask a question, or use a pre-existing value
     * to populate the answer.
     */

    app.define('ask', function (name, locals, cb) {
      if (typeof locals === 'function') {
        return this.ask(name, {}, locals);
      }
      var ctx = this.cache.data;
      if (typeof locals === 'object') {
        ctx = utils.merge({}, ctx, locals.hash || locals);
      }
      return ask.once(name, ctx, cb);
    });

    /**
     * Register an `ask` helper that can be used to prompt
     * the user from templates
     */

    app.asyncHelper('ask', function (name, locals, cb) {
      if (typeof locals === 'function') {
        cb = locals;
        locals = {};
      }
      locals = locals || {};
      var opts = utils.merge({}, locals.hash || locals);
      var args = [name, opts, cb];
      return this.app.ask.apply(this.app, args);
    });
  };
};
