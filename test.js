'use strict';

require('mocha');
var assert = require('assert');
var should = require('should');
var assemble = require('assemble');
var store = require('data-store');
var ask = require('./');
var app;

describe('ask', function () {
  this.timeout(5000);

  beforeEach(function () {
    app = assemble();
    app.store = store('assemble', app.options.store);
    app.use(ask());
  });

  afterEach(function () {
    app.store.del({force: true});
  });

  describe('methods', function (done) {
    it('should expose a `question` method', function () {
      assert(app.question);
      assert(typeof app.question === 'function');
    });

    it('should expose an `ask` method', function () {
      assert(app.ask);
      assert(typeof app.ask === 'function');
    });
  });

  describe('question string', function (done) {
    it('should answer with a default value:', function (done) {
      app.ask('foo', {foo: 'bar'}, function (err, answer) {
        assert(answer);
        assert(answer === 'bar');
        done();
      });
    });
  });

  describe('question store', function (done) {
    it('should add a `questions` object to the instance', function () {
      assert(app.questions);
    });

    it('should store a question', function () {
      app.question('name', 'what is your name?');
      assert(app.questions);
      assert(app.questions.cache);
      assert(app.questions.cache.name);
      assert(app.questions.cache.name.type === 'input');
      assert(app.questions.cache.name.message === 'what is your name?');
    });

    it('should ask a stored question and use a stored answer:', function (done) {
      app.question('name', 'what is your name?');
      app.ask('name', {name: 'doowb'}, function (err, answer) {
        assert(answer);
        assert(answer === 'doowb');
        done();
      });
    });

    it('should answer a question with a default value:', function (done) {
      app.ask('foo', {foo: 'bar'}, function (err, answer) {
        assert(answer);
        assert(answer === 'bar');
        done();
      });
    });

    it('should answer a question with a stored value:', function (done) {
      app.store.set('abc', 'xyz');
      app.ask('abc', function (err, answer) {
        assert(answer);
        assert(answer === 'xyz');
        done();
      });
    });

    it('should work as a helper', function (done) {
      app.engine('hbs', require('engine-handlebars'));
      app.create('pages', {engine: 'hbs'});
      app.store.set('abc', 'xyz');

      app.question('abc', 'What is abc?');

      app.page('foo.hbs', {content: '{{ask "abc"}}'})
        .render(function (err, view) {
          if (err) return done(err);
          assert(view.content);
          assert(view.content === 'xyz');
          app.store.del('abc');
          done();
        });
    });
  });
});
