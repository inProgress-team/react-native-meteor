require('shelljs/global');
var path = require('path');

if (!process.argv[2]) {
  echo('See ' + path.basename(__filename) + ' to customize your deploy command');
  return;
}

var projectName = require('./projectName');
if (!projectName) {
  echo('Please enter your project name in projectName.js');
}

var dirs = require('./dirs');

echo();
echo('Building Webpack bundles for deployment...');
echo();
require('./predeploy')(function(err) {
  if (err) exit(1);
  deploy();
});

function deploy() {
  switch (process.argv[2]) {

  case 'meteor.com':
    cd(dirs.meteor);
    exec('meteor deploy ' + projectName + '.meteor.com', {async: true});
    break;

  case 'modulus':
    env.METEOR_SETTINGS = cat('settings/prod.json');
    cd(dirs.meteor);
    exec('modulus deploy --project-name ' + projectName, {async: true});
    break;

  case 'mup':
    echo("Make sure to mup init and mup setup before first deploy");
    /*
     * you will also need to move settings/prod.json to settings/prod/settings.json
     * then mup init inside settings/prod/ so that mup uses the new settings.json
     * this will require a settings path change in ./dev script
     */
    cd('settings/prod');
    exec('mup deploy', {async: true});
    break;

  case 'demeteorizer':
    rm('-rf', 'dist/bundle');
    mkdir('-p', 'dist/bundle');
    cd(dirs.meteor);
    exec("demeteorizer -o ../dist/bundle --json '" + cat('../settings/prod.json') + "'", {async: true});
    // run your own command to deploy to your server
    break;

  default:
    echo('See ' + path.basename(__filename) + ' to customize your deploy command');
  }
}
