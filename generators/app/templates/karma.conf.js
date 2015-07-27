module.exports = function(config) {
  config.set({
    basePath: './',
    browsers: ['Chrome'],
    files: ['specs/**/*.js'],
    frameworks: ['mocha', 'browserify'],
    preprocessors: {
      'specs/**/*.js': ['browserify']
    },
    colors: true,
    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-browserify'
    ],
    browserify: {
      debug: true,
      transform: ['reactify', 'babelify']
    }
  });
};
