const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'development') {
  webpackConfig.entry.unshift('webpack-hot-middleware/client?reload=true');
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.devtool = 'source-map';

  const compiler = webpack(webpackConfig);
  // Use Webpack Dev Middleware to serve assets from memory
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.join(__dirname, 'public')));
  // Serve index.html from memory (via webpack-dev-middleware)
  app.get('*', (req, res) => {
    const filePath = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filePath, (err, result) => {
      if (err) {
        return res.status(404).send('File not found');
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  // In production, serve static files from 'build'
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
