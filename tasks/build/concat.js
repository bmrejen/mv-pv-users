var gulp        = require('gulp');
var concat      = require('gulp-concat');

gulp.task('concat:css', ['sass'], function() {
  return gulp.src([
                  'node_modules/primeicons/primeicons.css',
    return gulp.src([
        ..
        'node_modules/primeicons/primeicons.css',
        ..
    ]);
                  'node_modules/primeng/resources/primeng.css',
                  ])
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./dist/css'));
});

gulp.task('concat:js', function() {
  return gulp.src([
    'src/app/assets/js/google-api.js',
    'src/app/assets/js/gapi-methods.js',
    'node_modules/core-js/client/shim.js',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/systemjs/dist/system.src.js'
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('./dist/js'));
});
