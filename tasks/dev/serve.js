var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var watch       = require('gulp-watch');

gulp.task('serve', ['build'], function() {

    browserSync.init({
        proxy: "users.local",
        ghostMode: false,
        open: false
    });

    gulp.watch([
        "src/scss/**/*.scss"
    ], ['watch:css']);

    gulp.watch([
        "src/**/*.ts",
        "!src/app.version.ts",
        "src/app/**/*.html"
    ], ['watch:js']);

});

gulp.task('watch:css', ['build:css', 'copy:assets'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch:js', ['build:js'], function (done) {
    browserSync.reload();
    done();
});
