var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var pump = require('pump');
var uglify = require('gulp-uglify');

var paths = {
    sass: ['./scss/*.scss']
};

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

gulp.task('compress', function(cb) {
    pump([gulp.src(['js/*.js', 'template/**/*.js']),
        uglify(),
        gulp.dest('production-dist')
    ]);
});