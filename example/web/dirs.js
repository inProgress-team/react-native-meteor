var path = require('path');

module.exports = {
  webpack: path.join(__dirname, 'webpack'),
  meteor:  path.join(__dirname, 'meteor_core'),
};

module.exports.assets= path.join(module.exports.webpack, 'assets');
