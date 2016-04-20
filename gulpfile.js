const gulp = require('gulp')
const babel = require('gulp-babel')
const rollup = require('gulp-rollup')

gulp.task('build', ['build-server', 'build-client'])

gulp.task('build-server', () => {
  return gulp.src('src/server.js')
    .pipe(rollup({}))
    .pipe(babel({
      presets: ['es2015', 'stage-0']
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('build-client', () => {
  return gulp.src('example/reactotron/client.js')
    .pipe(rollup({}))
    .pipe(babel({
      presets: ['es2015', 'stage-0']
    }))
    .pipe(gulp.dest('./dist'))
})
