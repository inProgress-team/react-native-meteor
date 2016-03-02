require('shelljs/global');
var dirs = require('./dirs');
var fs = require('fs');
var path = require('path');
var coreJsBuild = require('core-js/build');

dirs.lib = path.join(dirs.webpack, 'lib');
if (!fs.existsSync(dirs.lib)) mkdir(dirs.lib);

var coreJsVersion = JSON.parse(fs.readFileSync('node_modules/core-js/package.json')).version;
var targetFileName = 'core-js-no-number.js';
var currentFileExist = fs.existsSync(path.join(dirs.lib, targetFileName));
var currentFileFewLines = currentFileExist ?
  fs.readFileSync(path.join(dirs.lib, targetFileName)).toString().substr(0, 130) : '';
var currentFileVersionRegex = /core-js (\d.\d.\d+)/m;
var currentFileVersion = currentFileVersionRegex.test(currentFileFewLines) ?
  currentFileVersionRegex.exec(currentFileFewLines)[1] : false;

if (coreJsVersion !== currentFileVersion) {
  echo('Building core-js@' + coreJsVersion + ' without ES6 number constructor...');
  coreJsBuild({
    modules: ['es5', 'es6', 'es7', 'js', 'web'],
    blacklist: ['es6.number.constructor'],
  }, function(error, code) {
    if (error) {
      console.error('core-js build error');
      return;
    }
    fs.writeFileSync(path.join(dirs.lib, targetFileName), code);
  });
}
else {
  echo('core-js@' + coreJsVersion + ' without ES6 number constructor is up to date');
}
