var path = require('path');

process.env.NODE_ENV = 'production';

module.exports = function (config) {
  config.set({
    //singleRun: true,
    reporters: [ 'dots' ],
    browsers: [ 'Chrome' ],
    files: [ './test/karma.bundle.js' ],
    frameworks: [ 'jasmine' ],
    plugins: [
      'karma-chrome-launcher',
      //'karma-firefox-launcher',
      'karma-jasmine',
      //'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      './test/karma.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    // use our own webpack config to mirror test setup
    webpack: require('./webpack/make-webpack-config')({
      target: 'client',
      mode: 'production',
      karma: true,
    }),
    webpackMiddleware: {
      noInfo: true,
    }
  });
};
