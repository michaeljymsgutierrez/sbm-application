var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var pump = require('pump');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');

var paths = {
    sass: ['./scss/*.scss']
};

/* Watch, Compile, Minify SASS to CSS */
gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
    gulp.src('./scss/bms.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./css/'))
        .on('end', done);
});

gulp.task('watch', ['sass'], function() {
    gulp.watch(paths.sass, ['sass']);
});

/* Compress Tasks for Minifying JS files for Production */
gulp.task('compress', function(cb) {
    pump([gulp.src(['js/*.js', 'template/**/*.js']),
        uglify(),
        gulp.dest('production-dist')
    ]);
});

/* Build Tasks for Executable Binaries */
gulp.task('build-linux', shell.task([
    'electron-packager . --overwrite --platform=linux --arch=x64 --icon=img/icon.png --prune=true --out=release-builds'
]));

gulp.task('build-windows', shell.task([
    'electron-packager . --overwrite --asar=true --platform=win32 --arch=ia32 --icon=img/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE'
]));

gulp.task('build-mac', shell.task([
    'electron-packager . --overwrite --platform=darwin --arch=x64 --icon=img/icon.icns --prune=true --out=release-builds'
]));

/* Server Electron */
gulp.task('serve', shell.task([
    'electron main.js'
]));

/* Execute Unit testing */
gulp.task('unit-test', shell.task([
    'mocha unit-testing/test.js'
]));