const gulp      = require('gulp');
const tslint    = require('gulp-tslint');
const jshint    = require('gulp-jshint');
const stylelint = require('gulp-stylelint');

gulp.task('lint', [
    'lint:ts',
]);

gulp.task('lint:ts', function () {
    return gulp.src(['./src/app/**/*.ts'])
        .pipe(tslint({
            configuration: './tslint-build.json',
            formatter: 'verbose'
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }));
});

gulp.task('lint:js', function () {
    return gulp.src('./build/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('lint:css', function () {
    return gulp.src('./dist/css/quotations.css')
        .pipe(stylelint({
            configFile: './.stylelintrc',
            reporters: [
                { formatter: 'string', console: true }
            ],
            debug: true
        }));
});
