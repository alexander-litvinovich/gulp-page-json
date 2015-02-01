var gutil = require('gulp-util');
var through = require('through2');

/* global Buffer */
module.exports = function(options) {
  'use strict';
  options = options || {};
  var summaryMarker = options.summaryMarker || "<!--more-->";
  var fileAttrs = options.fileAttrs || "data";
  var numArticlesInPage = options.numArticles || 10;
  var posts = [];  // all data
  var pushJson = function(path, obj) {
    this.push(new gutil.File({
      path: path,
      contents: new Buffer(JSON.stringify(obj, null, 2))
    }));
  };
  return through.obj(
    function (file, enc, cb) { // process all files and build summary
      var summary = file.contents.toString().split(summaryMarker)[0];
      file[fileAttrs].summary = summary;
      posts.push(file[fileAttrs]);
      return cb();
    },
    function(cb) { // make index.json and page*.json
      pushJson.apply(this, ["index.json", posts]);
      var page=[], pageNum;
      for (var i=0; i<posts.length; i++) {
        if (i && (i % numArticlesInPage) === 0) {
          pageNum = i/numArticlesInPage;
          pushJson.apply(this, ["page"+pageNum+".json", page]);
          page=[];
        }
        page.push(posts[i]);
      }
      if (page.length) {
        pageNum = (i+1)/numArticlesInPage;
        pushJson.apply(this, ["page"+pageNum+".json", page]);
      }
      return cb();
    }
  );
};
