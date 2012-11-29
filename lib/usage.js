// Generated by CoffeeScript 1.4.0
(function() {
  var clc, commandsDesc, commandsUsage, createSpace, util;

  util = require('util');

  clc = require('cli-color');

  commandsDesc = {
    deploy: 'Generate static files and deploy to github.',
    server: 'Start a server on http://localhost:3000 .',
    update: 'Generate the static files.',
    post: 'New post.',
    page: 'New page.',
    init: 'Init the project directory.',
    help: 'Display help.'
  };

  commandsUsage = {
    deploy: 'Generate static files and deploy to github.',
    server: 'Start a server on http://localhost:3000 .',
    update: '[-q] [project directory]\n[-q]                    Use quiet mod, do not print log.\n[project directory]     If not set directory then use current directory.',
    post: '[-f] <postname>\n\n<postname> Post name also file name, can\'t be \'index\'\n-f         Force to rewrite exist file.',
    page: '[-f] <pagename>\n\n-f     Force to rewrite exist file.',
    init: 'Init the project directory.'
  };

  createSpace = function(command, maxLength) {
    var i, spaceLength, str;
    spaceLength = maxLength - command.length;
    str = '';
    i = 0;
    while (spaceLength > i) {
      str += ' ';
      i++;
    }
    return str;
  };

  module.exports = {
    help: function() {
      var command, description, maxLength;
      util.puts(require('../package.json').name + ' is ' + require('../package.json').description);
      util.puts('');
      maxLength = 1;
      for (command in commandsDesc) {
        if (command.length > maxLength) {
          maxLength = command.length;
        }
      }
      maxLength += 5;
      for (command in commandsDesc) {
        description = commandsDesc[command];
        util.print('   ' + clc.yellow(command) + createSpace(command, maxLength));
        console.log(description);
      }
      return util.puts('');
    },
    puts: function(commandName) {
      return util.puts('Usage: blogin ' + commandName + ' ' + commandsUsage[commandName]);
    }
  };

}).call(this);