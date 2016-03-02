require('shelljs/global');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = env.NODE_ENV = 'production';
}

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

exec('node core-js-custom-build.js');

if (fs.existsSync(loadClientBundleLink)) rm(loadClientBundleLink);
if (fs.existsSync(serverBundleLink)) rm(serverBundleLink);

var serverCompiler = webpack(serverConfig);
var serverBundleReady = false;
var clientBundleReady = false;

serverCompiler.watch(serverConfig.watchOptions || {}, function(err, stats) {
  console.log(stats.toString(statsOptions));
  if (!serverBundleReady) {
    serverBundleReady = true;
    ln('-sf', serverBundlePath, serverBundleLink);
    compileClient();
  }
});

function compileClient() {
  var clientCompiler = webpack(clientConfig);
  clientCompiler.watch(clientConfig.watchOptions || {}, function(err, stats) {
    console.log(stats.toString(statsOptions));
    if (!clientBundleReady) {
      clientBundleReady = true;
      ln('-sf', clientBundlePath, clientBundleLink);
      runMeteor();
    }
  });
}

function runMeteor() {
  cd(dirs.meteor);
  exec('meteor run --production --settings ../settings/prod.json', {async: true});
}
