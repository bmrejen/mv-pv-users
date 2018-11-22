var changelog   = require('gulp-conventional-changelog');
var gulp        = require('gulp');

gulp.task('changelog', function () {
    return gulp.src('./CHANGELOG.md')
        .pipe(changelog({
            preset: 'angular'
        }))
        .pipe(gulp.dest('./'));
});
