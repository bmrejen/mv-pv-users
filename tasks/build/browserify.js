var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify-es').default;

gulp.task('browserify:app', ['build:version', 'compile'], function () {
    return browserify('./build/js/main.js')
        .bundle()
        .pipe(source('users.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('browserify:app:dist', ['build:version', 'compile'], function () {
    return browserify('./build/js/main.js')
        .transform('babelify', { presets: ["es2015"] })
        .bundle()
        .pipe(source('users.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('browserify:vendor', ['concat:js'], function () {
    return browserify('./build/js/vendor.js')
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('./dist/js'));
});
