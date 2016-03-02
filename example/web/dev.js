require('shelljs/global');
var fs = require('fs');
var path = require('path');
var dirs = require('./dirs');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var statsOptions = require('./statsOptions');

var makeConfig = require(path.join(dirs.webpack, 'make-webpack-config'));

var serverConfig = makeConfig({target: 'server', mode: 'dev'});
var clientConfig = makeConfig({target: 'client', mode: 'dev'});

if (!clientConfig.devServer) clientConfig.devServer = {};
if (!clientConfig.devServer.stats) clientConfig.devServer.stats = statsOptions;

var serverBundlePath = path.join(dirs.assets, 'server.bundle.js');
var serverBundleLink = path.join(dirs.meteor, 'server/server.bundle.min.js');
var clientBundleLink = path.join(dirs.meteor, 'client/client.bundle.min.js');
var loadClientBundleHtml = path.join(dirs.webpack, 'loadClientBundle.html');
var loadClientBundleLink = path.join(dirs.meteor, 'client/loadClientBundle.html');

exec('node core-js-custom-build.js');

if (fs.existsSync(clientBundleLink)) rm(clientBundleLink);
if (fs.existsSync(serverBundleLink)) rm(serverBundleLink);

var serverCompiler = webpack(serverConfig);
var serverBundleReady = false;

serverCompiler.watch({
  progress: true,
  colors: true,
}, function(err, stats) {
  console.log(stats.toString(statsOptions)) ;
  ln('-sf', serverBundlePath, serverBundleLink)
  if (!serverBundleReady) {
    serverBundleReady = true;
    compileClient();
    runMeteor();
  }
});

function compileClient() {
  var clientCompiler = webpack(clientConfig);
  var clientDevServer = new WebpackDevServer(clientCompiler, clientConfig.devServer);

  clientDevServer.listen(clientConfig.devServer.port, clientConfig.devServer.host, function() {});

  ln('-sf', loadClientBundleHtml, loadClientBundleLink);
}

function runMeteor() {
  cd(dirs.meteor);
  exec('meteor --settings ../settings/devel.json', {async: true});
}
