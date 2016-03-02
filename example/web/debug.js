require('shelljs/global');
exec('node-inspector', {async: true});
env.NODE_OPTIONS = '--debug=5858';
require('./dev');
