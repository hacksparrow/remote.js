
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function() {

});

gulp.task('transmitter', function() {
  return gulp.src(['src/remote.js', 'src/transmitter.js'])
    .pipe(concat('remote.transmitter.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('receiver', function() {
  return gulp.src(['src/remote.js', 'src/receiver.js'])
    .pipe(concat('remote.receiver.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function() {
  gulp.watch(['src/*.js'], ['transmitter', 'receiver']);
  gulp.watch(['dist/*.js'], function() {
    return gulp.src(['dist/*.js']).pipe(gulp.dest('examples/'));
  });
});

gulp.task('default', ['transmitter', 'receiver', 'watch']);