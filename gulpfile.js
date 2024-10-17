const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
// const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const { exec } = require('child_process');

const paths = {
  scss: 'src/scss/**/*.scss',
  cssOutput: 'src/css',
};

// Compile SCSS into CSS
gulp.task('scss', () => {
  return gulp
    .src('src/scss/main.scss')
    // Remove the following lines to disable source maps:
    // .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.cssOutput));
});

// Watch SCSS files for changes
gulp.task('watch-scss', () => {
  gulp.watch(paths.scss, gulp.series('scss'));
});

// Task to start the Express server
gulp.task('serve', (done) => {
  exec('node server.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    done(err);
  });
});

// Task to build the project using Webpack
gulp.task('build', (done) => {
  exec('npx webpack --mode production', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    done(err);
  });
});

// Default task to serve and watch for changes
gulp.task('default', gulp.parallel('serve', 'watch-scss'));
