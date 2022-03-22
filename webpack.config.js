'use strict';

import webpack from 'webpack';
import {VueLoaderPlugin} from 'vue-loader';
import path from 'path';
import {fileURLToPath} from 'url';

const DefinePlugin = webpack.DefinePlugin;

const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename);

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  resolve: {
    fallback: {

    }
  },

  plugins: [
    // Define Bundler Build Feature Flags
    new DefinePlugin({
      // Drop Options API from bundle
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: process.env.NODE_ENV === 'development',
    }),
    new VueLoaderPlugin(),
  ],
};

const serverConfig = Object.assign({}, baseConfig, {
  experiments: {
    outputModule: true,
    topLevelAwait: true,
  },

  // target: 'node',

  entry: path.join(path.resolve(__dirname, 'src'), 'main.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    // library: '[name]',
    libraryExport: 'default',
    libraryTarget: 'module', // you can use libraries everywhere, e.g requirejs, node
    umdNamedDefine: true,
  },
});
const clientConfig = Object.assign({}, baseConfig, {
  target: 'web',

  entry: path.join(path.resolve(__dirname, 'src'), 'client.js'),
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'dist'),
  },
});

export default [serverConfig];
