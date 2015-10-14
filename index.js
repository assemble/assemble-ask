/*!
 * assemble-ask <https://github.com/jonschlinkert/assemble-ask>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function (options) {
  return function (app) {

    function config(inst, ctx) {
      ctx = utils.merge({}, inst.store.data, ctx);
      return utils.ask({
        questions: inst.questions,
        store: inst.store,
        data: ctx
      });
    }

    /**
     * add a `questions` property to the Verb instance
     * @type {Object}
     */

    this.questions = utils.questions(options);

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
        utils.merge(ctx, locals);
      }
      var ask = config(this, ctx);
      return ask(name, ctx, cb);
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
      var args = [name, locals.hash || {}, cb];
      return this.app.ask.apply(this.app, args);
    });
  };
};
