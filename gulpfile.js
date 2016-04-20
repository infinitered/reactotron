const gulp = require('gulp')
const babel = require('gulp-babel')
const rollup = require('gulp-rollup')

gulp.task('build', ['build-server'])

gulp.task('build-server', () => {
  return gulp.src('server/index.js')
    .pipe(rollup({}))
    .pipe(babel({
      presets: ['es2015', 'stage-0']
    }))
    .pipe(gulp.dest('./dist'))
})
