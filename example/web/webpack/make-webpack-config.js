var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = function(options) {
  options = options || {};
  var target = options.target || process.env.TARGET;
  var mode = options.mode || options.env || options.NODE_ENV || process.env.NODE_ENV || 'dev';

  ////////////////////////////////////////////////////////////////////////////////
  // BASE
  ////////////////////////////////////////////////////////////////////////////////

  var config = {
    context: __dirname,
    entry: [
      './lib/core-js-no-number',
      'regenerator/runtime'
    ],
    output: {
      path: path.join(__dirname, 'assets'),
      publicPath: '/',
      pathinfo: true
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: path.join(__dirname, '../app')
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          exclude: /node_modules|lib/,
          query: {
            cacheDirectory: true,
            stage: 0
          }
        }
      ]
    },
    plugins: [
      new ProgressBarPlugin(),
    ]
  };

  ////////////////////////////////////////////////////////////////////////////////
  // CLIENT
  ////////////////////////////////////////////////////////////////////////////////

  if (target === 'client') {
    config = merge({
      entry: [ '../app/main_client' ],
      output: {
        filename: 'client.bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'Meteor.isClient': true,
          'Meteor.isServer': false
        }),
        new webpack.PrefetchPlugin("react"),
        new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment")
      ]
    }, config);

    ////////////////////////////////////////////////////////////////////////////////
    // CLIENT DEVELOPMENT
    ////////////////////////////////////////////////////////////////////////////////

    if (mode === 'dev' || mode === 'development') {
      var devProps = require('./devProps');

      config = merge.smart(config, {
        devtool: 'eval',
        entry: [
          'webpack-dev-server/client?' + devProps.baseUrl,
          'webpack/hot/only-dev-server'
        ],
        output: {
          publicPath: devProps.baseUrl + '/',
        },
        module: {
          loaders: [
            {
              test: /\.jsx?$/,
              loader: 'babel',
              exclude: /node_modules|lib/,
              query: {
                cacheDirectory: true,
                "stage": 0,
                "plugins": [
                  "react-transform"
                ],
                "extra": {
                  "react-transform": {
                    "transforms": [{
                      "transform": "react-transform-hmr",
                      "imports": ["react"],
                      // this is important for Webpack HMR:
                      "locals": ["module"]
                    },
                    {
                      "transform": "react-transform-catch-errors",
                      // the second import is the React component to render error
                      // (it can be a local path too, like './src/ErrorReporter')
                      "imports": ["react", "redbox-react"]
                    }]
                  }
                }
              }
            },
            {
              test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
              loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            }
          ]
        },
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin()
        ],
        devServer: {
          publicPath: devProps.baseUrl + '/',
          host: devProps.host,
          hot: true,
          historyApiFallback: true,
          contentBase: devProps.contentBase,
          port: devProps.webpackPort,
          stats: require('../statsOptions')
        }
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // SERVER
  ////////////////////////////////////////////////////////////////////////////////

  if (target === 'server') {
    config = merge({
      entry: [ '../app/main_server' ],
      output: {
        filename: 'server.bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.css$/,
            loader: 'null-loader'
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'Meteor.isClient': false,
          'Meteor.isServer': true
        })
      ]
    }, config);

    ////////////////////////////////////////////////////////////////////////////////
    // SERVER DEVELOPMENT
    ////////////////////////////////////////////////////////////////////////////////

    if (mode === 'dev' || mode === 'development') {
      config = merge(config, {
        devtool: 'source-map'
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PRODUCTION
  ////////////////////////////////////////////////////////////////////////////////

  if (mode === 'prod' || mode === 'production') {
    config = merge(config, {
      output: {
        pathinfo: false
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {warnings: false}
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(true)
      ]
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // KARMA
  ////////////////////////////////////////////////////////////////////////////////

  if (options.karma) {
   config = merge(config, {
      devtool: 'eval-source-map'
    });
  }

  if (process.argv.indexOf('--print-webpack-config') >= 0) {
    console.log('================================================================');
    console.log('Webpack config for: ' + JSON.stringify(options, null, 2));
    console.log('================================================================\n');
    console.log(JSON.stringify(config, null, 2));
  }

  return config;
};

if (!module.parent) {
  console.log(JSON.stringify(module.exports(), null, 2));
}
