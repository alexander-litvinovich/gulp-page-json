Gulp Pagination JSON Generator
==============================

Generates full index of all pages and pagination files in JSON format;
  * index.json
  * page1.json
  * page2.json
  * ...

Install
-------

    npm install gulp-page-json

Usage
-------

    var gulp        = require('gulp');
    var frontMatter = require('gulp-front-matter');
    var marked      = require('gulp-marked');
    var pageJson    = require('gulp-page-json');

    gulp.task('pages', function () {
        return gulp.src('content/pages/*.md')
            .pipe(frontMatter({propety: 'data', remove: true}))
            .pipe(pageJson({
              fileAttrs: "data",            //default: data
              summaryMarker: "<!--MORE-->", //default: <!--more-->
              numArticles: 15               //default: 10
            }, function(jsonFiles) {        // optional: custom callback 
              console.log('jsonFiles', jsonFiles);
            }))
            .pipe(gulp.dest('build'));
    });

Source files example
-----------------------

  * [post1.md](test/fixtures/1.md)
  * [post2.md](test/fixtures/2.md)
  * [post3.md](test/fixtures/3.md)

Output files example
-----------------------

  index.json

    [
      {
        "layout": "layout.html",
        "title": "title1",
        "summary": "Summary 1"
      },
      {
        "layout": "layout.html",
        "title": "title 2",
        "summary": "Summary 2"
      },
      {
        "layout": "layout.html",
        "title": "title 3",
        "summary": "Summary 3"
      }
    ]

  page1.json

    [
      {
        "layout": "layout.html",
        "title": "title1",
        "summary": "Summary 1"
      },
      {
        "layout": "layout.html",
        "title": "title 2",
        "summary": "Summary 2"
      }
    ]

  page2.json

    [
      {
        "layout": "layout.html",
        "title": "title 3",
        "summary": "Summary 3"
      }
   ]
 
LICENSE
--------

    MIT License Allen Kim
