var gulp        = require('gulp');
var gutil       = require('gutil');
var requireDir  = require('require-dir');
var runSequence = require('gulp-run-sequence');

requireDir('./tasks', {recurse: true});

gulp.task('dev', [
    'build',
    'serve'
]);

gulp.task('dist', [
    'build:dist',
    'minify:assets'
]);

gulp.task('build', [
    'clean',
    'build:css',
    'lint:css',
    'lint:ts',
    'build:js',
    'copy:assets'
]);

gulp.task('build:dist', [
    'clean',
    'build:css',
    'lint:css',
    'lint:ts',
    'build:js:dist',
    'copy:assets'
]);


gulp.task('publish:preminor', function () {
    runSequence(
        'bump:preminor',
        'dist',
        'changelog',
        'tag'
    );
});

gulp.task('publish:prerelease', function () {
    runSequence(
        'bump:prerelease',
        'dist',
        'changelog',
        'tag'
    );
});

gulp.task('publish:beta', function () {
    runSequence(
        'bump:beta',
        'dist',
        'changelog',
        'tag'
    );
});

gulp.task('publish:rc', function () {
    runSequence(
        'bump:rc',
        'dist',
        'changelog',
        'tag'
    );
});

gulp.task('publish:prepatch', function () {
    runSequence(
        'bump:prepatch',
        'dist',
        'changelog',
        'tag'
    );
});

gulp.task('publish:patch', function () {
    runSequence(
        'bump:patch',
        'dist',
        'changelog',
        'tag'
    );
});

gulp.task('publish:minor', function () {
    runSequence(
        'bump:minor',
        'dist',
        'changelog',
        'tag'
    );
});

gulp.task('publish:major', function () {
    runSequence(
        'bump:major',
        'dist',
        'changelog',
        'tag'
    );
});

gulp.task('release', function () {
    runSequence(
        'bump:timestamp',
        'dist'
    );
});
