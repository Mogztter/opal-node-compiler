const chai = require('chai');
const expect = chai.expect;

const Opal = require('opal-runtime').Opal;
const Builder = require('../src/index').Builder;
const ERB = require('../src/index').ERB;

describe('Opal Node Compiler', function () {

  describe('When loaded', function() {
    it('should export Opal object', function() {
      expect(Opal).not.be.null;
    });

    it('should export Builder object', function() {
      expect(Builder).not.be.null;
    });
  });

  describe('Builder', function() {
    it('should compile a simple hello world', function() {
      var builder = Builder.create();
      var result = builder.build('spec/fixtures/hello.rb');
      expect(result.toString()).to.match(/self\.\$puts\("Hello world"\)/);
    });

    it('should compile a simple inline hello world', function() {
      var builder = Builder.create();
      var result = builder.buildString('puts "Hello world"');
      expect(result.toString()).to.match(/self\.\$puts\("Hello world"\)/);
    });

    it('should compile a simple hello world library', function() {
      var builder = Builder.create();
      builder.appendPaths('spec/fixtures/hello-ruby/lib');
      builder.appendPaths('src/stdlib');
      var result = builder.build('hello');
      expect(result.toString()).to.match(/self\.\$puts\("Hello world"\)/);
    });

    it('should use front slash as module name', function() {
      var builder = Builder.create();
      builder.appendPaths('spec/fixtures/hello-ruby/lib');
      builder.appendPaths('src/stdlib');
      var result = builder.build('french/bonjour', {requirable: true});
      expect(result.toString()).to.match(/Opal\.modules\["french\/bonjour"\]/);
    });

    it('should compile a module that require a built-in Ruby module (logger)', function() {
      var builder = Builder.create();
      builder.appendPaths('src/stdlib');
      var result = builder.build('spec/fixtures/logging.rb');
      expect(result.toString()).to.match(/Opal\.modules\["logger"\]/);
    });

    it('should retrieve source maps', function() {
      var builder = Builder.create();
      builder.appendPaths('src/stdlib');
      builder.build('spec/fixtures/logging.rb');
      var sourceMap = builder.getSourceMap().source_maps[0];
      expect(sourceMap.file).to.equals('logger.rb');
      expect(sourceMap.source).to.match(/class Logger/);
    });
  });

  describe('ERB compiler', function () {
    it('should compile an ERB template', function() {
      var result = ERB.compile('The value of x is: <%= x %>');
      expect(result.toString()).to.match(/output_buffer\.\$append\("The value of x is: "\)/)
    });
  });
});
