var gulp        = require('gulp');
var rename      = require('gulp-rename');

gulp.task('copy:assets', [
    'copy:fonts',
    'copy:images'
]);

gulp.task('copy:fonts', ['clean:assets'], function() {
    return gulp.src([
        'src/scss/fonts/**.*',
    ])
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copy:images', ['clean:assets'], function() {
    return gulp.src([
        'src/assets/images/**/*.*'
    ])
    .pipe(gulp.dest('./dist/images'));
});
