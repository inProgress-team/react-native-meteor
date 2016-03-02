// require all foo_spec.js, bar_spec.jsx files in the app directory
var context = require.context('../app', true, /.+_spec\.jsx?$/);
context.keys().forEach(context);
module.exports = context;
