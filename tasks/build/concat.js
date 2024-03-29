var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat:css', ['sass'], function() {
    return gulp.src([
        // 'node_modules/primeicons/primeicons.css',
        // 'node_modules/primeng/resources/primeng.css',
        // 'node_modules/primeng/resources/themes/nova-colored/theme.css',
        "node_modules/ui-kit/mv.css",
        // "node_modules/ui-kit/pv.css",
    ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('concat:js', function() {
    return gulp.src([
        'node_modules/core-js/client/shim.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.src.js',
        "node_modules/ui-kit/mv.js",
        "node_modules/ui-kit/mv.js",

    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/js'));
});
