// Generated by CoffeeScript 1.4.0
(function() {
  var clc, dataApi, file, fileApi, fs, jade, moment, parseArg, path, projectDir, rendApi, templateDir, usage, util;

  util = require('util');

  clc = require('cli-color');

  fs = require('fs');

  path = require('path');

  jade = require('jade');

  moment = require('moment');

  file = require('./file');

  usage = require('./usage');

  parseArg = require('./arg').parse;

  templateDir = './public/template/';

  projectDir = './';

  fileApi = {
    getJadeFile: function(type) {
      return file.read(path.resolve(templateDir, type + '.jade'));
    },
    getSrcFile: function(type) {
      switch (type) {
        case 'page':
          return path.resolve(projectDir, 'data/pages');
        default:
          return path.resolve(projectDir, 'data/posts');
      }
    },
    getDestFile: function(type) {
      switch (type) {
        case 'archive':
          return path.resolve(projectDir, 'post');
        case 'post':
          return path.resolve(projectDir, 'post');
        case 'page':
          return path.resolve(projectDir, 'page');
        default:
          return path.resolve(projectDir, 'index.html');
      }
    },
    srcToDest: function(type, srcFilePath) {
      var fileUrl, relativePath;
      relativePath = path.relative(this.getSrcFile(type), srcFilePath);
      fileUrl = path.resolve(this.getDestFile(type), relativePath);
      return file.mdToHtml(fileUrl);
    },
    srcToUrl: function(type, srcFilePath) {
      var fileUrl, relativePath;
      relativePath = path.relative(this.getSrcFile(type), srcFilePath);
      fileUrl = path.resolve(this.getDestFile(type), relativePath);
      return file.pathToUrl(file.mdToHtml(fileUrl), projectDir);
    }
  };

  dataApi = {
    getPostList: function() {
      var fileList, items, postDir,
        _this = this;
      postDir = fileApi.getSrcFile('post');
      fileList = file.dir(postDir);
      items = [];
      fileList.forEach(function(filePath) {
        if (!file.isMd(filePath)) {
          return;
        }
        return items.push({
          title: file.pathToTitle(filePath),
          url: fileApi.srcToUrl('post', filePath)
        });
      });
      return items;
    },
    getPageList: function() {
      var fileList, items, pageDir,
        _this = this;
      pageDir = fileApi.getSrcFile('page');
      fileList = file.dir(pageDir);
      items = [];
      fileList.forEach(function(filePath) {
        if (!file.isMd(filePath)) {
          return;
        }
        return items.push({
          title: file.pathToTitle(filePath),
          url: fileApi.srcToUrl('page', filePath)
        });
      });
      return items;
    },
    getArchiveList: function() {
      var archiveDir, archiveList, items,
        _this = this;
      archiveDir = fileApi.getSrcFile('post');
      archiveList = file.dir(archiveDir, true);
      items = [];
      archiveList.forEach(function(filePath) {
        return items.push({
          title: file.getFileName(filePath),
          url: fileApi.srcToUrl('archive', filePath) + '/'
        });
      });
      return items;
    },
    getArchivePostList: function(archiveName) {
      var fileList, items, postDir,
        _this = this;
      postDir = path.resolve(fileApi.getSrcFile('post'), archiveName);
      fileList = file.dir(postDir);
      items = [];
      fileList.forEach(function(filePath) {
        if (!file.isMd(filePath)) {
          return;
        }
        return items.push({
          title: file.pathToTitle(filePath),
          url: fileApi.srcToUrl('post', filePath)
        });
      });
      return items;
    },
    getLocals: function(type, arg1) {
      var archiveName, keywords, locals;
      locals = {
        site: file.readJSON(path.resolve(projectDir, './blogin.json')),
        pageName: ''
      };
      switch (type) {
        case 'index':
          locals.items = this.getPostList();
          locals.archives = this.getArchiveList();
          locals.pages = this.getPageList();
          locals.metaKeywords = locals.site.keywords;
          locals.metaDescription = locals.site.description;
          break;
        case 'archive':
          archiveName = arg1;
          locals.pageName = archiveName;
          locals.items = this.getArchivePostList(archiveName);
          locals.metaKeywords = locals.site.keywords;
          locals.metaDescription = locals.site.description;
          break;
        case 'page':
          locals.pageName = arg1.title;
          locals.entry = arg1;
          locals.site.keywords = locals.site.keywords || '';
          keywords = locals.site.keywords.split(',');
          keywords.push(locals.pageName);
          locals.metaKeywords = keywords.join(',');
          locals.metaDescription = locals.pageName;
          break;
        case 'post':
          locals.pageName = arg1.title;
          locals.entry = arg1;
          locals.site.keywords = locals.site.keywords || '';
          keywords = locals.site.keywords.split(',');
          keywords.push(locals.pageName);
          locals.metaKeywords = keywords.join(',');
          locals.metaDescription = locals.pageName;
      }
      return locals;
    }
  };

  rendApi = {
    index: function(keepQuiet) {
      var compile, dest;
      dest = fileApi.getDestFile('index');
      compile = jade.compile(fileApi.getJadeFile('index'), {
        filename: path.resolve(templateDir, 'includes')
      });
      file.write(dest, compile(dataApi.getLocals('index')));
      if (!keepQuiet) {
        return util.puts('File ' + dest + ' created.');
      }
    },
    archive: function(keepQuiet) {
      var archives, compile, destDir, srcDir,
        _this = this;
      srcDir = fileApi.getSrcFile('archive');
      destDir = fileApi.getDestFile('archive');
      archives = file.dir(srcDir, true);
      compile = jade.compile(fileApi.getJadeFile('archive'), {
        filename: path.resolve(templateDir, 'includes')
      });
      return archives.forEach(function(archivePath) {
        var archiveDestFile, archiveName;
        archiveName = file.getFileName(archivePath);
        archiveDestFile = path.resolve(destDir, archiveName, 'index.html');
        file.write(archiveDestFile, compile(dataApi.getLocals('archive', archiveName)));
        if (!keepQuiet) {
          return util.puts('File ' + archiveDestFile + ' created.');
        }
      });
    },
    page: function(keepQuiet) {
      var compile, destDir, pages, srcDir,
        _this = this;
      srcDir = fileApi.getSrcFile('page');
      destDir = fileApi.getDestFile('page');
      pages = file.dir(srcDir, true);
      compile = jade.compile(fileApi.getJadeFile('page'), {
        filename: path.resolve(templateDir, 'includes')
      });
      return pages.forEach(function(pagePath) {
        var entry, pageFile, pageName, pageTitle;
        pageName = file.getFileName(pagePath).slice(0, -3);
        pageTitle = file.pathToTitle(pagePath);
        entry = {
          title: pageTitle,
          content: file.readMdToHtml(pagePath),
          time: file.getMTime(pagePath)
        };
        pageFile = fileApi.srcToDest('page', pagePath);
        file.write(pageFile, compile(dataApi.getLocals('page', entry)));
        if (!keepQuiet) {
          return util.puts('File ' + pageFile + ' created.');
        }
      });
    },
    post: function(keepQuiet) {
      var compile, destDir, posts, srcDir,
        _this = this;
      srcDir = fileApi.getSrcFile('post');
      destDir = fileApi.getDestFile('post');
      posts = file.dir(srcDir);
      compile = jade.compile(fileApi.getJadeFile('post'), {
        filename: path.resolve(templateDir, 'includes')
      });
      return posts.forEach(function(postPath) {
        var entry, postFile, postName, postTitle;
        postName = file.getFileName(postPath).slice(0, -3);
        postTitle = file.pathToTitle(postPath);
        entry = {
          title: postTitle,
          content: file.readMdToHtml(postPath),
          time: file.getMTime(postPath)
        };
        postFile = fileApi.srcToDest('post', postPath);
        console.log(file.readMdToHtml(postPath));
        file.write(postFile, compile(dataApi.getLocals('post', entry)));
        if (!keepQuiet) {
          return util.puts('File ' + postFile + ' created.');
        }
      });
    }
  };

  module.exports = function(args) {
    var arg, keepQuiet;
    arg = parseArg(args);
    projectDir = path.resolve('./', arg.req[0] || './');
    templateDir = path.resolve(projectDir, './public/template/');
    if (!fs.existsSync(templateDir)) {
      usage.puts('update');
      return;
    }
    keepQuiet = arg.opt.indexOf('q') > 0;
    rendApi.index(keepQuiet);
    rendApi.archive(keepQuiet);
    rendApi.page(keepQuiet);
    return rendApi.post(keepQuiet);
  };

}).call(this);