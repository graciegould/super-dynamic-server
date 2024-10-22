const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './src/index.js',  // Your JS entry point (can change if needed)
  ],
  output: {
     // Output to 'dist' folder
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // Serve from root
    publicPath: '/', 
  },
  mode: 'development',
  devtool: 'inline-source-map', // Useful for debugging
  module: {
    rules: [
      {
        // Babel transpiler for JS and React
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', 
      },
      {
         // Inject CSS into the DOM
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Be able to import HTML files
        test: /\.html$/,  
        use: ['html-loader'],
      },
    ],
  },
  plugins: [
    // For HMR
    new webpack.HotModuleReplacementPlugin(), 
    new HtmlWebpackPlugin({
      template: './src/index.html', 
      filename: 'index.html',
    }),
    // NOTE: Webpack resolves paths internally so we can use relative paths as if it was at the root
    // this is not the case for plugins like HtmlWebpackPlugin and CopyWebpackPlugin
    new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public'), 
            to: path.resolve(__dirname, '../dist'), 
            globOptions: {
              ignore: ['**/index.html'], // Optional: Ignore copying HTML if it's handled by HtmlWebpackPlugin
            },
          },
        ],
      }),
  ],
};
