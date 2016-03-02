require('shelljs/global');

var fs = require('fs');
var path = require('path');
var dirs = require('./dirs');
var webpack = require('webpack');
var statsOptions = require('./statsOptions');

var makeConfig = require(path.join(dirs.webpack, 'make-webpack-config'));

var serverConfig = makeConfig({target: 'server', mode: 'production'});
var clientConfig = makeConfig({target: 'client', mode: 'production'});

var serverBundlePath = path.join(dirs.assets, 'server.bundle.js');
var clientBundlePath = path.join(dirs.assets, 'client.bundle.js');
var serverBundleLink = path.join(dirs.meteor, 'server/server.bundle.min.js');
var clientBundleLink = path.join(dirs.meteor, 'client/client.bundle.min.js');
var loadClientBundleLink = path.join(dirs.meteor, 'client/loadClientBundle.html');

module.exports = function(callback) {
  exec('node core-js-custom-build.js');

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = env.NODE_ENV = 'production';
  }

  if (fs.existsSync(loadClientBundleLink)) rm(loadClientBundleLink);
  if (fs.existsSync(serverBundleLink)) rm(serverBundleLink);

  var serverCompiler = webpack(serverConfig);

  serverCompiler.run(function(err, stats) {
    if (err) {
      console.error(error);
      return callback(err);
    }
    console.log(stats.toString(statsOptions));
    if (stats.toJson().errors.length) {
      return callback(new Error('Webpack reported compilation errors'));
    }
    ln('-sf', serverBundlePath, serverBundleLink);
    compileClient();
  });

  function compileClient() {
    var clientCompiler = webpack(clientConfig);
    clientCompiler.run(function(err, stats) {
      if (err) {
        console.error(error);
        return callback(err);
      }
      console.log(stats.toString(statsOptions));
      if (stats.toJson().errors.length) {
        return callback(new Error('Webpack reported compilation errors'));
      }
      ln('-sf', clientBundlePath, clientBundleLink);
      return callback();
    });
  }
};
