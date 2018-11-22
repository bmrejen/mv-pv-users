var gulp        = require('gulp');
var gutil       = require('gutil');
var embedTpl    = require('gulp-angular-embed-templates');
var typescript  = require('gulp-tsc');
var exec        = require('child_process').exec;
var embedTpl    = require('gulp-angular-embed-templates');

gulp.task('compile', ['clean:js', 'build:version'], function (done) {
    exec('yarn run build:aot', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
});

gulp.task('compile:dist', ['clean:js', 'build:version'], function (done) {
    exec('yarn run build:aot', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
});
