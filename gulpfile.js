const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps'); // Use sourcemaps for dev
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const webpackConfig = isProduction
  ? require('./config/prod.config.js')
  : require('./config/dev.config.js'); // Load config based on environment

const paths = {
  scss: 'src/scss/**/*.scss',
  cssOutput: 'src/css',
};

// Helper function to clean the build folder (used in production)
function cleanBuildFolder() {
  const buildDir = path.resolve(__dirname, 'build');

  if (fs.existsSync(buildDir)) {
    fs.readdirSync(buildDir).forEach((file) => {
      const currentPath = path.join(buildDir, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        fs.rmdirSync(currentPath, { recursive: true });
      } else {
        fs.unlinkSync(currentPath);
      }
    });
  }

  return Promise.resolve();
}

// Compile SCSS into CSS with different handling for dev/prod
function compileSCSS() {
  return gulp
    .src('src/scss/main.scss')
    .pipe(isProduction ? sass().on('error', sass.logError) : sourcemaps.init()) // Initialize sourcemaps for dev
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(isProduction ? cleanCSS() : sourcemaps.write('.')) // Minify in prod and use sourcemaps in dev
    .pipe(gulp.dest(paths.cssOutput));
}

// Watch SCSS files for changes (for development mode)
function watchSCSS() {
  gulp.watch(paths.scss, compileSCSS);
}

// Webpack build task (runs in both development and production)
function buildWebpack() {
  return gulp
    .src('src/index.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('build'));
}

// Start server with nodemon
function startDevServer(done) {
  nodemon({
    script: 'server.js -d',
    ext: 'js',
    env: { NODE_ENV: process.env.NODE_ENV || 'development' },
    watch: ['server.js', 'api/'], // Watch for changes in server.js and api folder
    ignore: ['dist/', 'node_modules/'], // Ignore changes in dist and node_modules folders
  })
  .on('start', () => {
    console.log('Nodemon started the server');
  })
  .on('quit', () => {
    console.log('Nodemon quit');
    done();
  })
  .on('restart', (files) => {
    console.log('Nodemon restarted due to changes in: ', files);
  });

  done();
}

function startProdServer() {
  exec('node server.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    done(err);
  });
}

// Gulp task for development mode
gulp.task('dev', gulp.series(compileSCSS, gulp.parallel(buildWebpack, watchSCSS, startDevServer)));

// Gulp task for production mode
gulp.task('prod', gulp.series(cleanBuildFolder, compileSCSS, buildWebpack, startProdServer));

// Default task based on the environment
gulp.task('default', gulp.series(isProduction ? 'prod' : 'dev'));
