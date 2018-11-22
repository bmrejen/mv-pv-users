var gulp        = require('gulp');
var del         = require('del');
var stripDebug  = require('gulp-strip-debug');

gulp.task('clean', [
    'clean:assets',
    'clean:build'
]);

gulp.task('clean:assets', function () {
    return del([
        'dist/fonts',
        'dist/images',
        'node_modules/angular2-busy/index.ts'
    ], {dot: true});
});

gulp.task('clean:css', function () {
    return del([
        'dist/css/images',
        'dist/css'
    ], {dot: true});
});

gulp.task('clean:js', function () {
    return del([
        'build/js',
        'build/ts',
        'dist/js',
        'tmp/*'
    ], {dot: true});
});

gulp.task('clean:build', function () {
    return del([
        'build',
        'tmp/*'
    ], {dot: true});
});

gulp.task('clean:debug', ['minify:assets'], function () {
	return gulp.src('dist/js/users.js')
		.pipe(stripDebug())
		.pipe(gulp.dest('dist/js'));
});
