const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
// const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const { exec } = require('child_process');
const fs = require('fs');
const archiver = require('archiver');

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
    if (err) {
      done(err);
    } else {
      // Zip the build directory using archiver
      const output = fs.createWriteStream('build.zip');
      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });

      output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        done();
      });

      archive.on('error', function(err) {
        throw err;
      });

      archive.pipe(output);

      archive.directory('build/', false);

      archive.finalize();
    }
  });
});

// Task to clean the build.zip file before creating a new one
gulp.task('clean-zip', () => {
  return del(['build.zip']);
});

// Default task to clean and build
gulp.task('default', gulp.series('clean-zip', 'build'));