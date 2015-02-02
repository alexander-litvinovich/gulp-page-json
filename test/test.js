var gulp = require('gulp');
var pageJson = require('../');
var path = require('path');
var assert = require('stream-assert');
var frontMatter = require('gulp-front-matter');
var through = require('through2');
var expect = require('chai').expect;


/**
 * this requires output file test
 * i.e. input : 1.md, 2.md, 3.md, 4.md
 *      output: index.json, page1.json, page2.json
 */
describe('gulp-page-json', function() {
  'use strict';

  it('should build index.json and page*.json', function (done) {
    var test = function() {
      var files = [];
      return through.obj(
        function (file, enc, cb) { // collect all files
          files.push(file);
          return cb();
        },
        function(cb) { // test
          var index = files[0];
          expect(index.path).to.equal("index.json");
          expect(JSON.parse(index.contents).length).to.equal(3);
          var page1 = files[1];
          expect(page1.path).to.equal("page1.json");
          expect(JSON.parse(page1.contents).length).to.equal(2);
          var page2 = files[2];
          expect(page2.path).to.equal("page2.json");
          var obj = JSON.parse(page2.contents);
          expect(obj.length).to.equal(1);
          expect(obj[0].layout).to.equal("layout.html");
          expect(obj[0].title).to.equal("title 3");
          expect(obj[0].summary).to.equal("Summary 3");
          return cb();
        }
      );
    };

    gulp.src(__dirname + "/fixtures/*.md")
      .pipe(frontMatter({property: 'data', remove: true}))
      .pipe(pageJson({numArticles:2}))
      .pipe(test())
      .pipe(assert.end(done));
  });

  it('should build page number correctly', function (done) {
    var test = function() {
      var files = [];
      return through.obj(
        function (file, enc, cb) { // collect all files
          files.push(file);
          return cb();
        },
        function(cb) { // test
          var page1 = files[1];
          expect(page1.path).to.equal("page1.json");
          expect(JSON.parse(page1.contents).length).to.equal(3);
          return cb();
        }
      );
    };

    gulp.src(__dirname + "/fixtures/*.md")
      .pipe(frontMatter({property: 'data', remove: true}))
      .pipe(pageJson({numArticles:10}))
      .pipe(test())
      .pipe(assert.end(done));
  });

  it('should run callback if defined', function (done) {
    gulp.src(__dirname + "/fixtures/*.md")
      .pipe(frontMatter({property: 'data', remove: true}))
      .pipe(pageJson({numArticles:10}, function(files) {
        expect(files["index.json"]).to.ok;
        expect(files["page1.json"]).to.ok;
      }))
     .pipe(assert.end(done));
  });
});
