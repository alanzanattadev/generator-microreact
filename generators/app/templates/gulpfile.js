var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var react = require('gulp-react');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var flow = require('gulp-flowtype');
var karma = require('gulp-karma');
var babel = require('gulp-babel');
var babelify = require('babelify');
var taskListing = require('gulp-task-listing');

// -----------------------
//        CONFIG
// -----------------------

var paths = {
  karma: 'karma.conf.js',
  html: 'lib/*.html',
  style: 'lib/styles/*.scss',
  tests: 'specs/**/*.js',
  entry: 'lib/index.jsx',
  bundle: 'bundle.js',
  build: './dist',
  sourcemaps: './',
  js: 'lib/**/*.?(js|jsx)'
};

// -----------------------
// -----------------------
var customOpts = {
  entries: [paths.entry],
  transform: [reactify, babelify],
  extension: ["jsx", "js"],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var simpleSystem = browserify(opts);
var system;

function getBuildSystem(name) {
  return function() {
    if (name == "watch" && system === undefined) {
      system = watchify(simpleSystem);
      system.on('update', getBuildSystem("")); // on any dep update, runs the bundler
      system.on('log', gutil.log); // output build logs to terminal
    }
    else if (name == "simple")
      system = simpleSystem;
    return system.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(paths.bundle))
      // optional, remove if you don't need to buffer file contents
      .pipe(buffer())
      // optional, remove if you dont want sourcemaps
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(uglify())
      .pipe(sourcemaps.write(paths.sourcemaps)) // writes .map file
      .pipe(gulp.dest(paths.build));
  }
}

gulp.task('browserify:watch', getBuildSystem("watch"));

gulp.task('browserify:build', getBuildSystem("simple"));

gulp.task('browsersync', function() {
  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });
});

gulp.task('sass', function() {
  gulp
    .src(paths.style)
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.build));
});

gulp.task('sass:watch', function() {
  gulp.watch(paths.style, function() {
    gulp
      .src(paths.style)
      .pipe(sass().on('error', sass.logError))
      .pipe(minifyCss())
      .pipe(gulp.dest(paths.build))
      .pipe(browserSync.stream());
  });
});

gulp.task('html', function() {
    gulp
      .src(paths.html)
      .pipe(minifyHTML())
      .pipe(gulp.dest(paths.build));
});

gulp.task('html:watch', function() {
  gulp
    .watch(paths.html, ['html'])
    .on('change', browserSync.reload);
});

gulp.task('flow', function() {
  gulp
    .src(paths.js)
    .pipe(flow());
})

gulp.task('test', function() {
  gulp.src(paths.tests)
    .pipe(karma({
      configFile: paths.karma,
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('test:watch', function() {
  gulp.src(paths.tests)
    .pipe(karma({
      configFile: paths.karma,
      action: 'watch'
    }));
});

gulp.task('help', taskListing);
gulp.task('demo', ['browsersync']);
gulp.task('build', ["browserify:build", "sass", "html"]);
gulp.task('watch:build', ['html:watch', 'sass:watch', 'browserify:watch']);
gulp.task('watch', ['watch:build', 'browsersync']);
gulp.task('default', ['build', 'test', 'watch']);
