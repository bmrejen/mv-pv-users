var bump        = require('gulp-bump');
var exec        = require('child_process').exec;
var filter      = require('gulp-filter');
var fs          = require('fs');
var git         = require('gulp-git');
var gulp        = require('gulp');
var semver      = require('semver');
var tagversion  = require('gulp-tag-version');

var getPackageJson = function () {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

function bumpVersion(inc) {
    var pkg     = getPackageJson();

    var newVer = '0.0.0';
    if (inc === 'timestamp') {
        var currentDate = new Date();
        newVer = pkg.version +' - '+ currentDate.toUTCString();
    } else if (inc === 'rc') {
        newVer = semver.inc(pkg.version, 'pre', 'rc');
    } else if (inc === 'beta') {
        newVer = semver.inc(pkg.version, 'pre', 'beta');
    } else if (inc === 'prerelease') {
        newVer = semver.inc(pkg.version, 'preminor', 'beta');
    } else {
        newVer = semver.inc(pkg.version, inc);
    }

    fs.readFile('./package.json', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var regex  = new RegExp(pkg.version);
        var result = data.replace(regex, newVer);

        fs.writeFile('./package.json', result, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

gulp.task('tag', function () {
    var pkg         = getPackageJson();
    var newVer      = pkg.version;

    return gulp.src(['./package.json', './dist/css/**/*.css', './dist/js/**/*.js', 'CHANGELOG.md', './src/app.version.ts'])
        .pipe(git.add())
        .pipe(git.commit('chore(version): Bump to version ' + newVer))
        .pipe(filter('package.json'))
        .pipe(tagversion({version: newVer, label: 'Version %t'}));
});

gulp.task('bump:patch', function () {
    return bumpVersion('patch');
});

gulp.task('bump:minor', function () {
    return bumpVersion('minor');
});


gulp.task('bump:major', function () {
    return bumpVersion('major');
});

gulp.task('bump:timestamp', function () {
    return bumpVersion('timestamp');
});

gulp.task('bump:beta', function () {
    return bumpVersion('beta');
});

gulp.task('bump:rc', function () {
    return bumpVersion('rc');
});

gulp.task('bump:prerelease', function () {
    return bumpVersion('prerelease');
});
