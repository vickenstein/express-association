const gulp = require('gulp')
const clean = require('gulp-clean')
const ts = require('gulp-typescript')
const tsconfig = require('./tsconfig')
const tsProject = ts.createProject("tsconfig.json")
const cTable = require('console.table')

gulp.task('clean', (done) => {
  gulp.src(['dist/*'], {read: false})
      .pipe(clean())
  done()
})

gulp.task('ts:compile', (done) => {
  const project = gulp.src(tsconfig.include)
                      .pipe(tsProject())
  project.js.pipe(gulp.dest('dist'))
  project.dts.pipe(gulp.dest('types'))
  done()
})

gulp.task('routes', (done) => {
  console.table(require('test/example/router').toJson)
  done()
})

gulp.task('package', gulp.series('clean', 'ts:compile'))

gulp.task('ts:watch', (done) => {
  gulp.watch(tsconfig.files, gulp.series('ts:compile'))
  done()
})

gulp.task('default', gulp.series('package', 'ts:watch'))
