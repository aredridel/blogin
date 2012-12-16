// Generated by CoffeeScript 1.4.0
(function() {
  var BFile, PathApi, PostBFile, exports, marked,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BFile = require('./BFile');

  PathApi = require('./PathApi');

  marked = require('marked');

  marked.setOptions({
    gfm: true,
    pedantic: false,
    sanitize: false
  });

  PostBFile = (function(_super) {

    __extends(PostBFile, _super);

    function PostBFile(pwd, encoding) {
      this.pwd = pwd;
      this.encoding = encoding;
      PostBFile.__super__.constructor.call(this, this.pwd, this.encoding);
      this.type = 'post';
    }

    PostBFile.prototype.getTitle = function() {
      var content, firstLineLength;
      content = this.read();
      firstLineLength = content.indexOf('\n');
      return content.slice(0, firstLineLength);
    };

    PostBFile.prototype.getEscapeTitle = function() {
      return this.constructor.escapeName(str);
    };

    PostBFile.prototype.getJadeFile = function() {
      return new BFile(PathApi.getJadeFile(this.type)).read();
    };

    PostBFile.prototype.getUrl = function() {
      return PathApi.toUrl(this.pwd);
    };

    PostBFile.prototype.getHtml = function() {
      return marked(this.read());
    };

    PostBFile.prototype.createHtml = function() {
      var dest;
      dest = PathApi.getDestFile(this.type) + this.getEscapeTitle() + '.html';
      return new BFile(dest).write(this.getHtml());
    };

    return PostBFile;

  })(BFile);

  PostBFile.createPostFile = function(fileName) {};

  PostBFile.capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1);
  };

  /*
  unescape name
    'hello-world.md' => 'Hello world'
    'hello-world-border\\-left.md' => 'Hello world border-left.md'
  @param {string} str input string
  @return {string}
  */


  PostBFile.unescapeName = function(str) {
    return str.replace(/([^\\])\-/g, '$1 ').replace(/\\-/g, '-');
  };

  /*
  escape name
    'Hello World' => 'hello-world'
    '  Hello   World  ' => 'hello-world'
    'Hello World border-left' => 'hello-world-border\\-left'
  @param {string|array} str
  @return {string}
  */


  PostBFile.escapeName = function(str) {
    var escapedWords, filename, words;
    if (typeof str === 'object') {
      words = str;
    } else {
      words = [str];
    }
    escapedWords = [];
    words.forEach(function(word, i) {
      return escapedWords[i] = word.replace(/\-/g, '\\$1');
    });
    return filename = escapedWords.join('-').toLowerCase();
  };

  exports = PostBFile;

}).call(this);