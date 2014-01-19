
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
  gulp.run('transmitter', 'receiver');
  gulp.watch(['dist/*.js'], function(event) {
    gulp.src(['dist/*.js']).pipe(gulp.dest('example/'));
  });
});

gulp.task('transmitter', function() {
  gulp.src(['src/remote.js', 'src/transmitter.js'])
    .pipe(concat('remote.transmitter.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('receiver', function() {
  gulp.src(['src/remote.js', 'src/receiver.js'])
    .pipe(concat('remote.receiver.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});


gulp.task('default', function() {
  gulp.run('build');
  gulp.watch(['src/*.js'], function(event) {
    gulp.run('build');
  });
});
