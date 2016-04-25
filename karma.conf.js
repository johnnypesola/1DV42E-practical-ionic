// Karma configuration
// Generated on Mon Apr 25 2016 02:00:01 GMT+0200 (Västeuropa, sommartid)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'www/lib/ionic/js/ionic.bundle.js',
      'cordova.js',
      'www/lib/angular-messages/angular-messages.js',
      'www/lib/babel-polyfill/browser-polyfill.js',
      'www/lib/angular-aria/angular-aria.min.js',
      'www/lib/angular-material/angular-material.min.js',
      'www/lib/ionic/js/angular/angular-resource.min.js',
      // 'www/lib/ngCordova/dist/ng-cordova.js', // Makes no difference
      'www/js/app.js',
      'www/js/controllers/**/*.js',
      'www/js/shared/**/*.js',
      'www/lib/angular-mocks/angular-mocks.js',
      'tests/unit-tests/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/!(*.spec|*.mock|*-mock|*.e2e|*.po|*.test).js': ['coverage']
    },

    coverageReporter: {
      dir: 'test-reports/coverage/',
      reporters: [
        {type: 'html'},
        {type: 'text-summary'}
      ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
