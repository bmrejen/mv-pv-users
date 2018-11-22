var gulp        = require('gulp');
var sass        = require('gulp-sass');

gulp.task('sass', ['clean:css'], function () {
    return gulp.src('./src/scss/users.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});
