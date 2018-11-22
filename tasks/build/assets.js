var gulp  = require('gulp');
var shell = require('gulp-shell');

gulp.task('build:css', [
    'clean:css',
    'sass',
    'concat:css'
]);

gulp.task('build:js', [
    'clean:js',
    'concat:js',
    'compile'
]);

gulp.task('build:js:dist', [
    'clean:js',
    'concat:js',
    'compile:dist'
]);

gulp.task('build:version', function () {
    return gulp.src('bin/version.sh', {read: false})
        .pipe(shell('yarn run version'));
});
