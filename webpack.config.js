const path = require('path');

module.exports = {
  entry: './lib/app.js',
  devtool: 'sourcemap',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
