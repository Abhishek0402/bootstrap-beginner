'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');


gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./css/*.scss', ['sass']); //watch for any changes in the .scss files and if any then run the sass task
});

gulp.task('browser-sync', function () {
    var files = [
      './*.html',
      './css/*.css',
      './img/*.{png,jpg,gif}',
      './js/*.js'
   ];

    browserSync.init(files, { //initialize browser sync
        server: {
            baseDir: "./"
        }
    });

});

gulp.task('clean', function () {
    return del(['dist']);
});

//gulp.task('copyfonts', function() { //no extra module needed for copying
//   gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
//   .pipe(gulp.dest('./dist/fonts'));
//});

gulp.task('copyfonts', function () {

    return gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')

        .pipe(gulp.dest('./dist/fonts'));

});


gulp.task('imagemin', function () {
    return gulp.src('img/*.{png,jpg,gif}') //source
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })) //task
        .pipe(gulp.dest('dist/img')); //destination
});

gulp.task('usemin', function () {
    return gulp.src('./*.html')
        .pipe(flatmap(function (stream, file) {
            return stream
                .pipe(usemin({
                    css: [rev()],
                    html: [function () {
                        return htmlmin({
                            collapseWhitespace: true
                        })
                    }],
                    js: [uglify(), rev()],
                    inlinejs: [uglify()],
                    inlinecss: [cleanCss(), 'concat']
                }))
        }))
        .pipe(gulp.dest('dist/'));
});


//gulp.task('build',['clean'], function() {
//    gulp.start('copyfonts','imagemin','usemin');
//});
gulp.task('build', gulp.series('clean', 'copyfonts', 'imagemin', 'usemin', function (done) {
        done();
    }
));
// Default task
//gulp.task('default', ['browser-sync'], function() {   //first run the browser-sync task and then start the sass watch task
//    gulp.start('sass:watch');
//});
//gulp.task('default', gulp.series('browser-sync', 'sass:watch'));
