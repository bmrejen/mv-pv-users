var gulp        = require('gulp');
var cssmin      = require('gulp-cssmin');
var rename      = require('gulp-rename');
var uglifyjs    = require('uglify-js');
var minifier    = require('gulp-uglify/minifier');
var wrap        = require('gulp-css-wrap');

gulp.task('minify:assets', [
    // 'minify:js',
    'wrap:css',
    'minify:css'
]);

gulp.task('minify:js', [
    'minify:js:vendors',
    // 'minify:js:workers',
]);

gulp.task('wrap:css', ['build:css'], function () {
    return gulp.src('dist/css/*.css')
        .pipe(wrap({selector:'#app-users'}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('minify:css', ['wrap:css'], function () {
    return gulp.src('dist/css/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minify:js:vendors', ['build:js:dist'], function () {
    return gulp.src('dist/js/vendor.js')
        .pipe(minifier({mangle: false}, uglifyjs))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minify:js:workers', ['build:js:dist'], function () {
    return gulp.src('dist/js/workers/*.js')
        .pipe(minifier({mangle: false}, uglifyjs))
        .pipe(gulp.dest('dist/js/workers'));
});
