const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js', // Your main entry for JS (can change if needed)
  },
  devtool: 'source-map', // Generate source maps for better debugging
  output: {
    filename: '[name].[contenthash].js', // Use contenthash for cache busting
    path: path.resolve(__dirname, 'build'), // Output to the build folder
    publicPath: '/', // Ensure the correct base path for assets
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Removes console.log statements
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single', // Separate runtime code for better caching
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env'],
                ['@babel/preset-react', { runtime: 'automatic' }]  
              ],
            },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          'css-loader',
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          // Extract SCSS into separate files and Compiles SCSS to CSS
          MiniCssExtractPlugin.loader, 
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        // Output images to build/images
        generator: {
          filename: 'images/[name].[hash][ext]', 
        },
      },
      {
        test: /\.html$/,
        // Minify HTML
        use: ['html-loader'], 
      },
    ],
  },
  plugins: [
    // Clean the build folder before each build
    new CleanWebpackPlugin(), 
    // Use contenthash for cache busting
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', 
    }),
    // Ensure your HTML template is in the src folder
    new HtmlWebpackPlugin({
      template: './src/index.html', 
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          // Output all public assets to build/public
          from: path.resolve(__dirname, 'public'),
          to: 'public',
          noErrorOnMissing: true, 
        },
      ],
    }),
  ],
  performance: {
    hints: false,
  },
};
